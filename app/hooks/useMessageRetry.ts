import { useState, useCallback } from 'react';

export const useMessageRetry = () => {
  const [failedMessages, setFailedMessages] = useState<Set<string>>(new Set());
  
  const retryMessage = useCallback(async (messageId: string, sendFn: () => Promise<void>) => {
    try {
      await sendFn();
      setFailedMessages(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    } catch (error) {
      console.error('Retry failed:', error);

    }
  }, []);

  return { failedMessages, retryMessage };
}; 