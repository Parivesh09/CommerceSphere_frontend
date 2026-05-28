import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { getWebSocketManager } from './WebSocketManager';
import { WS_URL } from '../../constants';

/**
 * WebSocket Provider Component
 * 
 * Initializes the WebSocket manager with the Redux store.
 * Should be placed near the root of the application.
 * 
 * Validates: Requirements 8.1, 8.2
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();

  useEffect(() => {

    const wsManager = getWebSocketManager({ url: WS_URL });
    wsManager.initialize(store);

    return () => {

      wsManager.disconnect();
    };
  }, [store]);

  return <>{children}</>;
}
