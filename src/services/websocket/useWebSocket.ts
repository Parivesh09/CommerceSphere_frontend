import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { getWebSocketManager } from './WebSocketManager';
import type { WebSocketStatus, WebSocketState } from './types';
import { WS_URL } from '../../constants';

/**
 * React hook for WebSocket connection management
 * 
 * Automatically connects when user is authenticated and disconnects on logout.
 * Provides connection status and state to components.
 * 
 * Validates: Requirements 8.1, 8.2, 8.5
 */
export function useWebSocket() {
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    reconnectAttempts: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {

      const wsManager = getWebSocketManager({ url: WS_URL });
      wsManager.disconnect();
      return;
    }


    const wsManager = getWebSocketManager({ url: WS_URL });
    wsManager.connect(accessToken);


    const statusInterval = setInterval(() => {
      setStatus(wsManager.getStatus());
      setState(wsManager.getState());
    }, 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, [isAuthenticated, accessToken]);

  return {
    status,
    state,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isReconnecting: status === 'reconnecting',
    isDisconnected: status === 'disconnected',
    hasError: status === 'error',
  };
}
