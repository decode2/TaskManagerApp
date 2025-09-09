import { useEffect, useRef, RefObject } from 'react';

export interface UseClickOutsideOptions {
  enabled?: boolean;
  ignoreElements?: (string | RefObject<HTMLElement>)[];
}

/**
 * Custom hook for detecting clicks outside of a referenced element
 * 
 * @param handler - Function to call when clicking outside
 * @param options - Configuration options
 * @returns Ref to attach to the element
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const ref = useClickOutside(() => setIsOpen(false));
 * 
 * return (
 *   <div ref={ref}>
 *     {isOpen && <Dropdown />}
 *   </div>
 * );
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  options: UseClickOutsideOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { enabled = true, ignoreElements = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check if click is inside the referenced element
      if (ref.current && ref.current.contains(target)) {
        return;
      }

      // Check if click is on ignored elements
      for (const ignoreElement of ignoreElements) {
        let element: HTMLElement | null = null;

        if (typeof ignoreElement === 'string') {
          element = document.querySelector(ignoreElement);
        } else if (ignoreElement.current) {
          element = ignoreElement.current;
        }

        if (element && element.contains(target)) {
          return;
        }
      }

      // Click is outside, call handler
      handler();
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, enabled, ignoreElements]);

  return ref;
}

/**
 * Hook for detecting clicks outside with multiple elements
 * 
 * @param handler - Function to call when clicking outside
 * @param refs - Array of refs to check
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * const ref1 = useRef<HTMLDivElement>(null);
 * const ref2 = useRef<HTMLDivElement>(null);
 * 
 * useClickOutsideMultiple(
 *   () => setIsOpen(false),
 *   [ref1, ref2],
 *   { enabled: isOpen }
 * );
 * ```
 */
export function useClickOutsideMultiple(
  handler: () => void,
  refs: RefObject<HTMLElement>[],
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, ignoreElements = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check if click is inside any of the referenced elements
      const isInsideAnyRef = refs.some(ref => 
        ref.current && ref.current.contains(target)
      );

      if (isInsideAnyRef) {
        return;
      }

      // Check if click is on ignored elements
      for (const ignoreElement of ignoreElements) {
        let element: HTMLElement | null = null;

        if (typeof ignoreElement === 'string') {
          element = document.querySelector(ignoreElement);
        } else if (ignoreElement.current) {
          element = ignoreElement.current;
        }

        if (element && element.contains(target)) {
          return;
        }
      }

      // Click is outside all elements, call handler
      handler();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, enabled, ignoreElements, refs]);
}

/**
 * Hook for detecting clicks outside with escape key support
 * 
 * @param handler - Function to call when clicking outside or pressing escape
 * @param options - Configuration options
 * @returns Ref to attach to the element
 * 
 * @example
 * ```tsx
 * const ref = useClickOutsideWithEscape(() => setIsOpen(false));
 * 
 * return (
 *   <div ref={ref}>
 *     {isOpen && <Modal />}
 *   </div>
 * );
 * ```
 */
export function useClickOutsideWithEscape<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  options: UseClickOutsideOptions = {}
): RefObject<T | null> {
  const ref = useClickOutside<T>(handler, options);

  useEffect(() => {
    if (!options.enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handler, options.enabled]);

  return ref;
}
