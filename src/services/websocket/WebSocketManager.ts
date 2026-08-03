import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import type { Store } from '@reduxjs/toolkit';
import type { OrderStatus } from '../../types';
import type { 
  WebSocketConfig, 
  WebSocketMessage, 
  WebSocketState, 
  WebSocketStatus,
  OrderUpdatePayload,
  NotificationPayload
} from './types';

/**
 * WebSocket Manager
 * 
 * Manages WebSocket connection with automatic reconnection, exponential backoff,
 * message handling, and integration with RTK Query cache.
 * 
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Message queue for offline notifications
 * - RTK Query cache updates
 * - Toast notifications for order updates
 * - Connection state management
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 */
export class WebSocketManager {
  private socket: Socket | null = null;
  private store: Store | null = null;
  private config: Required<WebSocketConfig>;
  private state: WebSocketState;
  private messageQueue: WebSocketMessage[] = [];
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      reconnectAttempts: config.reconnectAttempts ?? 5,
      reconnectDelay: config.reconnectDelay ?? 1000,
      maxReconnectDelay: config.maxReconnectDelay ?? 30000,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
    };

    this.state = {
      status: 'disconnected',
      reconnectAttempts: 0,
    };


    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  /**
   * Initialize WebSocket manager with Redux store
   * Required for RTK Query cache updates
   */
  public initialize(store: Store): void {
    this.store = store;
  }

  /**
   * Connect to WebSocket server with authentication token
   * 
   * Validates: Requirement 8.1
   */
  public connect(token: string): void {
    if (this.socket?.connected) {
      console.warn('WebSocket already connected');
      return;
    }

    this.updateStatus('connecting');

    try {
      this.socket = io(this.config.url, {
        auth: { token },
        transports: ['websocket'],
        reconnection: false, // We handle reconnection manually
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.updateStatus('error');
      this.scheduleReconnect(token);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.clearTimers();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateStatus('disconnected');
    this.state.reconnectAttempts = 0;
  }

  /**
   * Get current connection status
   */
  public getStatus(): WebSocketStatus {
    return this.state.status;
  }

  /**
   * Get current connection state
   */
  public getState(): WebSocketState {
    return { ...this.state };
  }

  /**
   * Setup event handlers for WebSocket connection
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('error', this.handleError);
    this.socket.on('message', this.handleMessage);
    

    this.socket.on('order:update', this.handleOrderUpdate);
    this.socket.on('notification', this.handleNotification);
  }

  /**
   * Handle successful connection
   * 
   * Validates: Requirement 8.4 (flush offline queue)
   */
  private handleConnect = (): void => {
    console.log('WebSocket connected');
    this.updateStatus('connected');
    this.state.reconnectAttempts = 0;
    this.state.lastError = undefined;


    this.startHeartbeat();


    if (this.messageQueue.length > 0) {
      console.log(`Flushing ${this.messageQueue.length} queued messages`);
      this.flushMessageQueue();
    }
  };

  /**
   * Handle disconnection
   * 
   * Validates: Requirement 8.2 (automatic reconnection)
   */
  private handleDisconnect = (reason: string): void => {
    console.log('WebSocket disconnected:', reason);
    this.clearTimers();
    this.updateStatus('disconnected');


    if (reason !== 'io client disconnect') {
      const token = this.getAuthToken();
      if (token) {
        this.scheduleReconnect(token);
      }
    }
  };

  /**
   * Handle connection errors
   */
  private handleError = (error: Error): void => {
    console.error('WebSocket error:', error);
    this.state.lastError = error.message;
    this.updateStatus('error');
  };

  /**
   * Handle incoming WebSocket messages
   * 
   * Validates: Requirement 8.2 (message handling)
   */
  private handleMessage = (message: WebSocketMessage): void => {
    console.log('WebSocket message received:', message);


    if (!this.isOnline) {
      this.queueMessage(message);
      return;
    }


    switch (message.type) {
      case 'ORDER_UPDATE':
      case 'ORDER_CREATED':
      case 'ORDER_CANCELLED':
      case 'PAYMENT_COMPLETED':
      case 'SHIPMENT_UPDATE':
        this.handleOrderUpdate(message.payload as OrderUpdatePayload);
        break;
      case 'NOTIFICATION':
        this.handleNotification(message.payload as NotificationPayload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  };

  /**
   * Handle order update messages
   * 
   * Validates: Requirements 8.1, 8.2 (order updates and cache integration)
   */
  private handleOrderUpdate = (payload: OrderUpdatePayload): void => {
    const { orderId, status, message } = payload;


    if (this.store) {
      try {

        import('../../services/api/orderApi').then(({ orderApi }) => {

          const updateAction = orderApi.util.updateQueryData('getOrderById', orderId, (draft) => {
            if (draft?.data) {
              draft.data.status = status as OrderStatus;
              draft.data.updatedAt = new Date().toISOString();
            }
          });
          
          this.store!.dispatch(updateAction as never);


          const invalidateAction = orderApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }]);
          this.store!.dispatch(invalidateAction as never);
        });
      } catch (error) {
        console.error('Failed to update order cache:', error);
      }
    }


    const statusMessages: Record<string, string> = {
      PENDING_PAYMENT: 'Order is pending payment',
      PAID: 'Payment confirmed',
      PROCESSING: 'Order is being processed',
      SHIPPED: 'Order has been shipped',
      DELIVERED: 'Order delivered',
      CANCELLED: 'Order cancelled',
    };

    const toastMessage = message || statusMessages[status] || `Order ${orderId} updated`;
    
    toast.success(toastMessage, {
      duration: 5000,
      icon: this.getStatusIcon(status),
    });
  };

  /**
   * Handle notification messages
   * 
   * Validates: Requirement 8.3 (toast notifications)
   */
  private handleNotification = (payload: NotificationPayload): void => {
    const { type, message, title } = payload;
    const displayMessage = title ? `${title}: ${message}` : message;

    switch (type) {
      case 'success':
        toast.success(displayMessage);
        break;
      case 'error':
        toast.error(displayMessage);
        break;
      case 'warning':
        toast(displayMessage, { icon: '⚠️' });
        break;
      case 'info':
        toast(displayMessage, { icon: 'ℹ️' });
        break;
    }
  };

  /**
   * Queue message for later processing when offline
   * 
   * Validates: Requirement 8.4 (offline notification queueing)
   */
  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);
    console.log(`Message queued (${this.messageQueue.length} in queue)`);
  }

  /**
   * Flush queued messages when coming back online
   * 
   * Validates: Requirement 8.4 (offline notification queueing)
   */
  private flushMessageQueue(): void {
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach((message) => {
      this.handleMessage(message);
    });
  }

  /**
   * Schedule reconnection with exponential backoff
   * 
   * Validates: Requirement 8.2 (automatic reconnection with exponential backoff)
   */
  private scheduleReconnect(token: string): void {
    if (this.state.reconnectAttempts >= this.config.reconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.updateStatus('error');
      toast.error('Unable to connect to real-time updates. Please refresh the page.');
      return;
    }

    this.updateStatus('reconnecting');
    this.state.reconnectAttempts++;


    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.state.reconnectAttempts - 1),
      this.config.maxReconnectDelay
    );

    console.log(
      `Scheduling reconnection attempt ${this.state.reconnectAttempts}/${this.config.reconnectAttempts} in ${delay}ms`
    );

    this.reconnectTimer = setTimeout(() => {
      console.log(`Reconnection attempt ${this.state.reconnectAttempts}`);
      this.connect(token);
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.clearHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Clear heartbeat timer
   */
  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    this.clearHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    console.log('Network online');
    this.isOnline = true;
    

    if (this.state.status === 'disconnected' || this.state.status === 'error') {
      const token = this.getAuthToken();
      if (token) {
        this.connect(token);
      }
    }


    if (this.messageQueue.length > 0) {
      this.flushMessageQueue();
    }
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('Network offline');
    this.isOnline = false;
  };

  /**
   * Update connection status
   */
  private updateStatus(status: WebSocketStatus): void {
    this.state.status = status;
  }

  /**
   * Get authentication token from Redux store
   */
  private getAuthToken(): string | null {
    if (!this.store) return null;
    
    const state = this.store.getState() as any;
    return state.auth?.accessToken || null;
  }

  /**
   * Get icon for order status
   */
  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      PAID: '✅',
      PROCESSING: '⚙️',
      SHIPPED: '📦',
      DELIVERED: '🎉',
      CANCELLED: '❌',
    };
    return icons[status] || '📋';
  }

  /**
   * Cleanup on destroy
   */
  public destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.disconnect();
  }
}


let wsManagerInstance: WebSocketManager | null = null;

/**
 * Get WebSocket manager singleton instance
 */
export function getWebSocketManager(config?: WebSocketConfig): WebSocketManager {
  if (!wsManagerInstance && config) {
    wsManagerInstance = new WebSocketManager(config);
  }
  
  if (!wsManagerInstance) {
    throw new Error('WebSocketManager not initialized. Provide config on first call.');
  }
  
  return wsManagerInstance;
}

/**
 * Destroy WebSocket manager instance
 */
export function destroyWebSocketManager(): void {
  if (wsManagerInstance) {
    wsManagerInstance.destroy();
    wsManagerInstance = null;
  }
}
