import { useRef, useEffect, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventDefaultTouchmoveEvent = true
}: SwipeGestureOptions) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const attachSwipeListeners = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const detachSwipeListeners = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', handleTouchStart);
      elementRef.current.removeEventListener('touchmove', handleTouchMove);
      elementRef.current.removeEventListener('touchend', handleTouchEnd);
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    return () => {
      detachSwipeListeners();
    };
  }, [detachSwipeListeners]);

  return { attachSwipeListeners, detachSwipeListeners };
};
