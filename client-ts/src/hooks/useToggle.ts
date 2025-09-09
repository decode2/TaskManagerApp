import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing boolean state with toggle functionality
 * 
 * @param initialValue - Initial boolean value
 * @returns Array with [value, toggle, setValue, setTrue, setFalse]
 * 
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen, open, close] = useToggle(false);
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={open}>Open</button>
 *     <button onClick={close}>Close</button>
 *     {isOpen && <Modal />}
 *   </div>
 * );
 * ```
 */
export function useToggle(
  initialValue: boolean = false
): [
  boolean,
  () => void,
  (value: boolean) => void,
  () => void,
  () => void
] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setValue, setTrue, setFalse];
}

/**
 * Hook for managing multiple boolean states
 * 
 * @param initialValues - Object with initial boolean values
 * @returns Object with toggle functions for each key
 * 
 * @example
 * ```tsx
 * const toggles = useMultipleToggle({
 *   isOpen: false,
 *   isVisible: true,
 *   isEnabled: false
 * });
 * 
 * return (
 *   <div>
 *     <button onClick={toggles.isOpen.toggle}>Toggle Open</button>
 *     <button onClick={toggles.isVisible.setTrue}>Show</button>
 *     <button onClick={toggles.isEnabled.setFalse}>Disable</button>
 *   </div>
 * );
 * ```
 */
export function useMultipleToggle<T extends Record<string, boolean>>(
  initialValues: T
): {
  [K in keyof T]: {
    value: boolean;
    toggle: () => void;
    setValue: (value: boolean) => void;
    setTrue: () => void;
    setFalse: () => void;
  };
} {
  const [values, setValues] = useState<T>(initialValues);

  const createToggle = (key: keyof T) => ({
    value: values[key],
    toggle: () => {
      setValues(prev => ({ ...prev, [key]: !prev[key] }));
    },
    setValue: (value: boolean) => {
      setValues(prev => ({ ...prev, [key]: value }));
    },
    setTrue: () => {
      setValues(prev => ({ ...prev, [key]: true }));
    },
    setFalse: () => {
      setValues(prev => ({ ...prev, [key]: false }));
    },
  });

  const toggles = {} as {
    [K in keyof T]: {
      value: boolean;
      toggle: () => void;
      setValue: (value: boolean) => void;
      setTrue: () => void;
      setFalse: () => void;
    };
  };

  for (const key in initialValues) {
    toggles[key] = createToggle(key);
  }

  return toggles;
}

/**
 * Hook for managing toggle state with automatic reset
 * 
 * @param initialValue - Initial boolean value
 * @param resetDelay - Delay in milliseconds before auto-reset
 * @returns Array with [value, toggle, setValue, setTrue, setFalse, reset]
 * 
 * @example
 * ```tsx
 * const [isSuccess, toggle, setIsSuccess, showSuccess, hideSuccess, reset] = useToggleWithReset(
 *   false,
 *   3000 // auto-reset after 3 seconds
 * );
 * 
 * const handleSubmit = async () => {
 *   await submitForm();
 *   showSuccess(); // Will auto-reset after 3 seconds
 * };
 * ```
 */
export function useToggleWithReset(
  initialValue: boolean = false,
  resetDelay: number = 0
): [
  boolean,
  () => void,
  (value: boolean) => void,
  () => void,
  () => void,
  () => void
] {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const toggle = useCallback(() => {
    setValue(prev => !prev);
    
    if (resetDelay > 0) {
      clearTimeoutRef();
      timeoutRef.current = setTimeout(() => {
        setValue(initialValue);
      }, resetDelay);
    }
  }, [initialValue, resetDelay]);

  const setValueCallback = useCallback((newValue: boolean) => {
    setValue(newValue);
    
    if (resetDelay > 0) {
      clearTimeoutRef();
      timeoutRef.current = setTimeout(() => {
        setValue(initialValue);
      }, resetDelay);
    }
  }, [initialValue, resetDelay]);

  const setTrue = useCallback(() => {
    setValue(true);
    
    if (resetDelay > 0) {
      clearTimeoutRef();
      timeoutRef.current = setTimeout(() => {
        setValue(initialValue);
      }, resetDelay);
    }
  }, [initialValue, resetDelay]);

  const setFalse = useCallback(() => {
    setValue(false);
    clearTimeoutRef();
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    clearTimeoutRef();
  }, [initialValue]);

  useEffect(() => {
    return () => {
      clearTimeoutRef();
    };
  }, []);

  return [value, toggle, setValueCallback, setTrue, setFalse, reset];
}
