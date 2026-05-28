import { useWebSocket } from '../../services/websocket';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WebSocket Status Indicator Component
 * 
 * Displays the current WebSocket connection status to the user.
 * Shows connecting, reconnecting, and error states.
 * 
 * Validates: Requirements 8.5, 14.3
 */
export function WebSocketStatus() {
  const { status, state } = useWebSocket();


  if (status === 'connected' || status === 'disconnected') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          text: 'Connecting to real-time updates...',
          color: 'bg-blue-500',
          icon: '🔄',
        };
      case 'reconnecting':
        return {
          text: `Reconnecting... (attempt ${state.reconnectAttempts})`,
          color: 'bg-yellow-500',
          icon: '🔄',
        };
      case 'error':
        return {
          text: state.lastError || 'Connection error',
          color: 'bg-red-500',
          icon: '⚠️',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50"
      >
        <div
          className={`${config.color} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}
        >
          <span className="animate-spin">{config.icon}</span>
          <span className="text-sm font-medium">{config.text}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
