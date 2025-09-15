import React from 'react';

// Modal Header Component
interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

// Modal Body Component
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8'
};

export const ModalBody: React.FC<ModalBodyProps> = ({ 
  children, 
  className = '', 
  padding = 'md' 
}) => (
  <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800/50 ${paddingClasses[padding]} ${className}`}>
    {children}
  </div>
);

// Modal Footer Component
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between'
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className = '', 
  align = 'right' 
}) => (
  <div className={`flex items-center space-x-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 ${alignClasses[align]} ${className}`}>
    {children}
  </div>
);

// Modal Title Component
interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h2' 
}) => (
  <Component className={`text-xl font-semibold text-slate-800 dark:text-white no-select ${className}`}>
    {children}
  </Component>
);

// Modal Description Component
interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalDescription: React.FC<ModalDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-600 dark:text-slate-400 mt-1 ${className}`}>
    {children}
  </p>
);

// Close Button Component
interface ModalCloseButtonProps {
  onClose: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ 
  onClose, 
  className = '', 
  size = 'md' 
}) => (
  <button
    onClick={onClose}
    className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 no-select ${className}`}
    aria-label="Close modal"
  >
    <svg className={`${sizeClasses[size]} text-slate-500 dark:text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);
