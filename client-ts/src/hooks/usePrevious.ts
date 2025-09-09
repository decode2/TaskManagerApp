import { useRef, useEffect } from 'react';

/**
 * Custom hook for tracking the previous value of a state or prop
 * 
 * @param value - The current value to track
 * @returns The previous value
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * useEffect(() => {
 *   if (prevCount !== undefined && prevCount !== count) {
 *     console.log(`Count changed from ${prevCount} to ${count}`);
 *   }
 * }, [count, prevCount]);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

/**
 * Hook for tracking multiple previous values
 * 
 * @param values - Object with current values to track
 * @returns Object with previous values
 * 
 * @example
 * ```tsx
 * const [user, setUser] = useState(null);
 * const [theme, setTheme] = useState('light');
 * 
 * const prevValues = usePreviousValues({ user, theme });
 * 
 * useEffect(() => {
 *   if (prevValues.user !== user) {
 *     console.log('User changed');
 *   }
 *   if (prevValues.theme !== theme) {
 *     console.log('Theme changed');
 *   }
 * }, [user, theme, prevValues]);
 * ```
 */
export function usePreviousValues<T extends Record<string, any>>(
  values: T
): Partial<T> {
  const ref = useRef<Partial<T>>({});

  useEffect(() => {
    ref.current = { ...values };
  });

  return ref.current;
}

/**
 * Hook for tracking previous value with custom comparison
 * 
 * @param value - The current value to track
 * @param compareFn - Custom comparison function
 * @returns Object with previous value and whether it changed
 * 
 * @example
 * ```tsx
 * const [user, setUser] = useState(null);
 * const { prevValue, hasChanged } = usePreviousWithCompare(
 *   user,
 *   (prev, current) => prev?.id !== current?.id
 * );
 * 
 * useEffect(() => {
 *   if (hasChanged) {
 *     console.log('User ID changed');
 *   }
 * }, [hasChanged]);
 * ```
 */
export function usePreviousWithCompare<T>(
  value: T,
  compareFn: (prev: T | undefined, current: T) => boolean = (prev, current) => prev !== current
): {
  prevValue: T | undefined;
  hasChanged: boolean;
} {
  const ref = useRef<T | undefined>(undefined);
  const prevValue = ref.current;
  const hasChanged = compareFn(prevValue, value);

  useEffect(() => {
    ref.current = value;
  });

  return {
    prevValue,
    hasChanged,
  };
}
