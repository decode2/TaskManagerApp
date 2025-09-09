import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
}

export interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Custom hook for handling async operations with loading states and error handling
 * 
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns Object with data, loading, error states and control functions
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute, retry } = useAsync(fetchUserData, {
 *   immediate: true,
 *   onSuccess: (data) => console.log('User loaded:', data),
 *   onError: (error) => console.error('Failed to load user:', error)
 * });
 * 
 * // Execute manually
 * const handleRefresh = () => execute(userId);
 * 
 * // Retry on error
 * const handleRetry = () => retry();
 * ```
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const retryCountRef = useRef(0);
  const lastArgsRef = useRef<any[]>([]);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    lastArgsRef.current = args;
    retryCountRef.current = 0;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction(...args);
      setState(prev => ({ ...prev, data: result, loading: false }));
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, error: errorObj, loading: false }));
      
      if (onError) {
        onError(errorObj);
      }
      
      return null;
    }
  }, [asyncFunction, onSuccess, onError]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (retryCountRef.current >= retryCount) {
      return null;
    }

    retryCountRef.current++;
    
    // Add delay before retry
    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    return execute(...lastArgsRef.current);
  }, [execute, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    retryCountRef.current = 0;
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

/**
 * Hook for handling async operations with automatic retry on error
 * 
 * @param asyncFunction - The async function to execute
 * @param retryCount - Number of retries on failure
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Object with data, loading, error states and control functions
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsyncWithRetry(
 *   fetchTasks,
 *   3, // retry 3 times
 *   1000 // 1 second delay between retries
 * );
 * ```
 */
export function useAsyncWithRetry<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  retryCount: number = 3,
  retryDelay: number = 1000
): UseAsyncReturn<T> {
  return useAsync(asyncFunction, {
    retryCount,
    retryDelay,
  });
}

/**
 * Hook for handling async operations with polling
 * 
 * @param asyncFunction - The async function to execute
 * @param interval - Polling interval in milliseconds
 * @param options - Configuration options
 * @returns Object with data, loading, error states and control functions
 * 
 * @example
 * ```tsx
 * const { data, loading, error, startPolling, stopPolling } = useAsyncPolling(
 *   fetchStatus,
 *   5000, // poll every 5 seconds
 *   { immediate: true }
 * );
 * 
 * // Start/stop polling
 * const handleStart = () => startPolling();
 * const handleStop = () => stopPolling();
 * ```
 */
export function useAsyncPolling<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  interval: number,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> & {
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
} {
  const asyncResult = useAsync(asyncFunction, options);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPolling(true);
    intervalRef.current = setInterval(() => {
      asyncResult.execute();
    }, interval);
  }, [asyncResult.execute, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...asyncResult,
    startPolling,
    stopPolling,
    isPolling,
  };
}
