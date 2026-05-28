# WebSocket Integration

This module provides real-time communication capabilities for the e-commerce frontend application using Socket.IO.

## Features

- ✅ Automatic connection management with authentication
- ✅ Exponential backoff reconnection strategy
- ✅ Offline message queueing
- ✅ RTK Query cache integration
- ✅ Toast notifications for order updates
- ✅ Connection status monitoring
- ✅ Heartbeat mechanism for connection health

## Architecture

### Components

1. **WebSocketManager** - Core WebSocket connection manager
   - Handles connection lifecycle
   - Implements reconnection logic with exponential backoff
   - Manages message queue for offline scenarios
   - Integrates with RTK Query cache

2. **WebSocketProvider** - React context provider
   - Initializes WebSocket manager with Redux store
   - Should be placed near the root of the application

3. **useWebSocket** - React hook
   - Provides connection status to components
   - Automatically connects/disconnects based on auth state

4. **WebSocketStatus** - UI component
   - Displays connection status to users
   - Shows connecting, reconnecting, and error states

## Usage

### Basic Setup

The WebSocket integration is already set up in `App.tsx`:

```tsx
import { WebSocketProvider } from './services/websocket';
import { WebSocketStatus } from './components/ui';

function App() {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Router>
          {/* Your routes */}
          <WebSocketStatus />
        </Router>
      </WebSocketProvider>
    </Provider>
  );
}
```

### Using the Hook

```tsx
import { useWebSocket } from '@/services/websocket';

function MyComponent() {
  const { status, isConnected, isReconnecting } = useWebSocket();

  return (
    <div>
      {isConnected && <span>Connected to real-time updates</span>}
      {isReconnecting && <span>Reconnecting...</span>}
    </div>
  );
}
```

### Manual Connection Control

```tsx
import { getWebSocketManager } from '@/services/websocket';


const wsManager = getWebSocketManager({ url: WS_URL });


wsManager.connect(accessToken);


wsManager.disconnect();


const status = wsManager.getStatus();
```

## Message Types

The WebSocket manager handles the following message types:

### Order Updates
```typescript
{
  type: 'ORDER_UPDATE',
  payload: {
    orderId: string;
    status: string;
    message?: string;
  }
}
```

### Notifications
```typescript
{
  type: 'NOTIFICATION',
  payload: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
  }
}
```

## Reconnection Strategy

The WebSocket manager implements exponential backoff for reconnection:

- **Initial delay**: 1 second
- **Max delay**: 30 seconds
- **Max attempts**: 5
- **Formula**: `delay = min(baseDelay * 2^(attempt - 1), maxDelay)`

Example progression:
1. 1s
2. 2s
3. 4s
4. 8s
5. 16s

## Offline Support

When the user goes offline:
1. Messages are queued in memory
2. Connection attempts are paused
3. When back online, queued messages are processed
4. Connection is automatically re-established

## RTK Query Integration

Order updates received via WebSocket automatically update the RTK Query cache:

```typescript

ordersApi.util.updateQueryData('getOrderById', orderId, (draft) => {
  draft.status = newStatus;
  draft.updatedAt = new Date().toISOString();
});


ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }]);
```

This ensures the UI stays in sync without manual refetching.

## Configuration

Configure the WebSocket manager via environment variables:

```env
VITE_WS_URL=wss://api.example.com
```

Or programmatically:

```typescript
const wsManager = new WebSocketManager({
  url: 'wss://api.example.com',
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  heartbeatInterval: 30000,
});
```

## Testing

The WebSocket integration can be tested by:

1. **Connection**: Verify connection establishes on login
2. **Reconnection**: Simulate network interruption and verify reconnection
3. **Message Handling**: Send test messages and verify cache updates
4. **Offline Queue**: Go offline, send messages, come back online
5. **Toast Notifications**: Verify notifications appear for order updates

## Requirements Validation

This implementation validates the following requirements:

- **8.1**: WebSocket order updates trigger notifications ✅
- **8.2**: WebSocket events update RTK Query cache ✅
- **8.3**: Toast notifications for order status changes ✅
- **8.4**: Offline notifications are queued ✅
- **8.5**: Real-time updates occur through Redux state changes ✅

## Troubleshooting

### Connection Issues

If the WebSocket fails to connect:
1. Check the `VITE_WS_URL` environment variable
2. Verify the backend WebSocket server is running
3. Check browser console for error messages
4. Verify authentication token is valid

### Messages Not Received

If messages aren't being received:
1. Check WebSocket connection status
2. Verify message format matches expected types
3. Check browser console for errors
4. Verify RTK Query cache is properly configured

### Performance Issues

If experiencing performance issues:
1. Check message queue size (shouldn't grow unbounded)
2. Verify heartbeat interval is appropriate
3. Check for memory leaks in message handlers
4. Monitor reconnection attempts

## Future Enhancements

Potential improvements:
- [ ] Message acknowledgment system
- [ ] Compression for large messages
- [ ] Binary message support
- [ ] Multiple channel subscriptions
- [ ] Message replay on reconnection
- [ ] Metrics and monitoring integration
