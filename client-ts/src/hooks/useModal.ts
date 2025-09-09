import { useState, useCallback, useEffect } from 'react';

interface UseModalOptions {
  initialOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventBodyScroll?: boolean;
}

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * Custom hook for managing modal state and behavior
 * 
 * @param options Configuration options for the modal
 * @returns Modal state and control functions
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useModal();
 * 
 * return (
 *   <>
 *     <button onClick={open}>Open Modal</button>
 *     <Modal isOpen={isOpen} onClose={close}>
 *       <ModalContent />
 *     </Modal>
 *   </>
 * );
 * ```
 */
export const useModal = (options: UseModalOptions = {}): UseModalReturn => {
  const {
    initialOpen = false,
    closeOnEscape = true,
    preventBodyScroll = true
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventBodyScroll]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen
  };
};

/**
 * Hook for managing multiple modals
 * 
 * @param modalIds Array of modal IDs to manage
 * @returns Object with modal states and control functions
 * 
 * @example
 * ```tsx
 * const modals = useMultipleModals(['profile', 'settings', 'help']);
 * 
 * return (
 *   <>
 *     <button onClick={modals.profile.open}>Open Profile</button>
 *     <button onClick={modals.settings.open}>Open Settings</button>
 *     
 *     <Modal isOpen={modals.profile.isOpen} onClose={modals.profile.close}>
 *       <ProfileContent />
 *     </Modal>
 *   </>
 * );
 * ```
 */
export const useMultipleModals = (modalIds: string[]) => {
  const [modals, setModals] = useState<Record<string, boolean>>(
    modalIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
  );

  const open = useCallback((id: string) => {
    setModals(prev => ({ ...prev, [id]: true }));
  }, []);

  const close = useCallback((id: string) => {
    setModals(prev => ({ ...prev, [id]: false }));
  }, []);

  const toggle = useCallback((id: string) => {
    setModals(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const closeAll = useCallback(() => {
    setModals(prev => 
      Object.keys(prev).reduce((acc, id) => ({ ...acc, [id]: false }), {})
    );
  }, []);

  const openAll = useCallback(() => {
    setModals(prev => 
      Object.keys(prev).reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
  }, []);

  // Create individual modal controls
  const modalControls = modalIds.reduce((acc, id) => ({
    ...acc,
    [id]: {
      isOpen: modals[id] || false,
      open: () => open(id),
      close: () => close(id),
      toggle: () => toggle(id),
      setOpen: (isOpen: boolean) => {
        if (isOpen) {
          open(id);
        } else {
          close(id);
        }
      }
    }
  }), {} as Record<string, UseModalReturn>);

  return {
    ...modalControls,
    closeAll,
    openAll,
    modals
  };
};
