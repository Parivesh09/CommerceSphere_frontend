import { useEffect } from 'react';
import { useGetOrderByIdQuery } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED'];
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Custom hook for polling active orders
 * Polls order status every 30 seconds for active orders
 * Validates: Requirements 18.3
 */
export function useOrderPolling(orderId: string, currentStatus: OrderStatus) {
  const shouldPoll = ACTIVE_STATUSES.includes(currentStatus);

  const { refetch } = useGetOrderByIdQuery(orderId, {
    skip: !shouldPoll,
    pollingInterval: shouldPoll ? POLLING_INTERVAL : 0,
  });

  useEffect(() => {
    if (shouldPoll) {
      const interval = setInterval(() => {
        refetch();
      }, POLLING_INTERVAL);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [shouldPoll, refetch]);

  return { isPolling: shouldPoll };
}
