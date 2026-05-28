import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Network status hook for offline detection
 * 
 * Monitors the browser's online/offline status and provides:
 * - Current online/offline state
 * - Toast notifications when status changes
 * - Automatic detection of network changes
 * 
 * Validates: Requirement 14.3 (Offline state detection and display)
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
      

      if (wasOffline) {
        toast.success('Connection restored', {
          icon: '🌐',
          duration: 3000,
        });
      }
      
      setWasOffline(false);
    };


    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      
      toast.error('You are offline', {
        icon: '📡',
        duration: Infinity, // Keep showing until back online
        id: 'offline-toast', // Prevent duplicate toasts
      });
    };


    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);


    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      

      toast.dismiss('offline-toast');
    };
  }, [wasOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}
