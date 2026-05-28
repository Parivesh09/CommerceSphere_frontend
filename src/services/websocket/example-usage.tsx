/**
 * Example Usage of WebSocket Integration
 * 
 * This file demonstrates how to use the WebSocket integration
 * in various scenarios throughout the application.
 */

import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { getWebSocketManager } from './WebSocketManager';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

/**
 * Example 1: Display connection status in a component
 */
export function ConnectionStatusExample() {
  const { status, isConnected, isReconnecting, state } = useWebSocket();

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">WebSocket Status</h3>
      <div className="space-y-2">
        <p>Status: {status}</p>
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        {isReconnecting && (
          <p>Reconnecting... (Attempt {state.reconnectAttempts})</p>
        )}
        {state.lastError && (
          <p className="text-red-500">Error: {state.lastError}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Example 2: Automatically connect on authentication
 * (This is already handled by the useWebSocket hook)
 */
export function AutoConnectExample() {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      console.log('User authenticated, WebSocket will connect automatically');
    } else {
      console.log('User not authenticated, WebSocket will disconnect');
    }
  }, [isAuthenticated, accessToken]);

  return null;
}

/**
 * Example 3: Manual connection control
 */
export function ManualConnectionExample() {
  const handleConnect = () => {
    const wsManager = getWebSocketManager({ url: 'wss://api.example.com' });
    const token = 'your-auth-token';
    wsManager.connect(token);
  };

  const handleDisconnect = () => {
    const wsManager = getWebSocketManager({ url: 'wss://api.example.com' });
    wsManager.disconnect();
  };

  return (
    <div className="space-x-2">
      <button onClick={handleConnect} className="px-4 py-2 bg-blue-500 text-white rounded">
        Connect
      </button>
      <button onClick={handleDisconnect} className="px-4 py-2 bg-red-500 text-white rounded">
        Disconnect
      </button>
    </div>
  );
}

/**
 * Example 4: Show notification when order updates are received
 * (This is automatically handled by the WebSocketManager)
 * 
 * When a message like this is received:
 * {
 *   type: 'ORDER_UPDATE',
 *   payload: {
 *     orderId: '123',
 *     status: 'SHIPPED',
 *     message: 'Your order has been shipped!'
 *   }
 * }
 * 
 * The WebSocketManager will:
 * 1. Update the RTK Query cache for that order
 * 2. Show a toast notification
 * 3. Update the UI automatically
 */

/**
 * Example 5: Display orders with real-time updates
 */
export function OrdersWithRealtimeUpdates() {
  const { isConnected } = useWebSocket();



  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
        <span className="text-sm">
          {isConnected ? 'Real-time updates active' : 'Real-time updates inactive'}
        </span>
      </div>
      
      {/* Your orders list here */}
      <div className="space-y-2">
        {/* Orders will automatically update when WebSocket messages arrive */}
      </div>
    </div>
  );
}

/**
 * Example 6: Testing WebSocket in development
 * 
 * To test the WebSocket integration:
 * 
 * 1. Start your backend WebSocket server
 * 2. Login to the application
 * 3. Open browser DevTools console
 * 4. Send a test message from the backend:
 * 
 * Backend code (Node.js with Socket.IO):
 * ```javascript
 * io.to(userId).emit('order:update', {
 *   orderId: '123',
 *   status: 'SHIPPED',
 *   message: 'Your order has been shipped!'
 * });
 * ```
 * 
 * 5. You should see:
 *    - Console log: "WebSocket message received"
 *    - Toast notification with the message
 *    - Order status updated in the UI
 */

/**
 * Example 7: Handling offline scenarios
 * 
 * The WebSocket manager automatically handles offline scenarios:
 * 
 * 1. When user goes offline:
 *    - Messages are queued
 *    - Connection attempts stop
 *    - UI shows offline indicator
 * 
 * 2. When user comes back online:
 *    - Queued messages are processed
 *    - Connection is re-established
 *    - UI updates with queued data
 * 
 * To test:
 * 1. Open DevTools Network tab
 * 2. Set throttling to "Offline"
 * 3. Have backend send messages
 * 4. Set throttling back to "Online"
 * 5. Messages should appear
 */

/**
 * Example 8: Integration with order detail page
 */
export function OrderDetailWithRealtimeExample({ orderId: _orderId }: { orderId: string }) {
  const { isConnected } = useWebSocket();



  return (
    <div>
      <div className="mb-4">
        {isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-800">
              🔄 This order will update automatically when status changes
            </p>
          </div>
        )}
      </div>
      
      {/* Order details here */}
      <div>
        {/* Order information will update in real-time via WebSocket */}
      </div>
    </div>
  );
}

/**
 * Example 9: Custom message handler
 * 
 * If you need to handle custom message types, you can extend the WebSocketManager:
 * 
 * 1. Add your message type to types.ts:
 *    export type WebSocketMessageType = ... | 'CUSTOM_EVENT';
 * 
 * 2. Add handler in WebSocketManager.ts:
 *    case 'CUSTOM_EVENT':
 *      this.handleCustomEvent(message.payload);
 *      break;
 * 
 * 3. Implement the handler:
 *    private handleCustomEvent = (payload: any): void => {
 *      // Your custom logic here
 *    };
 */

/**
 * Example 10: Monitoring connection health
 */
export function ConnectionHealthMonitor() {
  const { status, state } = useWebSocket();

  const getHealthColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
      case 'reconnecting':
        return 'text-yellow-500';
      case 'error':
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getHealthColor()}`} />
        <div>
          <p className="text-sm font-medium">WebSocket</p>
          <p className="text-xs text-gray-500">{status}</p>
          {state.reconnectAttempts > 0 && (
            <p className="text-xs text-gray-500">
              Attempts: {state.reconnectAttempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
