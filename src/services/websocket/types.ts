/**
 * WebSocket Message Types
 * 
 * Defines the structure of messages exchanged via WebSocket
 */

export type WebSocketMessageType = 
  | 'ORDER_UPDATE'
  | 'ORDER_CREATED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_COMPLETED'
  | 'SHIPMENT_UPDATE'
  | 'NOTIFICATION';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
}

export interface OrderUpdatePayload {
  orderId: string;
  status: string;
  message?: string;
}

export interface NotificationPayload {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  maxReconnectDelay?: number;
  heartbeatInterval?: number;
}

export type WebSocketStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface WebSocketState {
  status: WebSocketStatus;
  reconnectAttempts: number;
  lastError?: string | undefined;
}
