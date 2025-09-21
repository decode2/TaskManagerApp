import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search API call
 *     searchTasks(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing function calls
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns The debounced function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback(
 *   (searchTerm: string) => {
 *     searchTasks(searchTerm);
 *   },
 *   300,
 *   []
 * );
 * 
 * // Use in input onChange
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return debouncedCallback;
}

/**
 * Hook for debouncing with immediate execution option
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns Object with debounced value and control functions
 * 
 * @example
 * ```tsx
 * const { value: debouncedValue, cancel, flush } = useDebounceAdvanced(
 *   searchTerm,
 *   300,
 *   false
 * );
 * 
 * // Cancel pending debounce
 * const handleCancel = () => cancel();
 * 
 * // Execute immediately
 * const handleFlush = () => flush();
 * ```
 */
export function useDebounceAdvanced<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): {
  value: T;
  cancel: () => void;
  flush: () => void;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isFirstCall = useRef(true);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const flush = () => {
    cancel();
    setDebouncedValue(value);
  };

  useEffect(() => {
    if (immediate && isFirstCall.current) {
      setDebouncedValue(value);
      isFirstCall.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      isFirstCall.current = false;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, immediate]);

  return {
    value: debouncedValue,
    cancel,
    flush,
  };
}
