import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, ThemeName } from '../hooks/useTheme';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './ui';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, isDark, setTheme, toggleDarkMode, availableThemes } = useTheme();

  const handleThemeSelect = (theme: ThemeName) => {
    setTheme(theme);
    // Don't close immediately, let user see the change
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <ModalHeader>
        <div>
          <h2 className="text-2xl font-bold text-primary">Choose Your Theme</h2>
          <p className="text-secondary mt-1">Select a color palette that matches your style</p>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Dark Mode Toggle */}
        <div className="mb-6 p-4 border border-light rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Dark Mode</h3>
              <p className="text-secondary text-sm">Switch between light and dark appearance</p>
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                isDark ? 'bg-accent-primary' : 'bg-tertiary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-medium"
                animate={{ x: isDark ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Theme Grid */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Available Themes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {availableThemes.map((theme) => (
              <motion.div
                key={theme.name}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-colors duration-150 ${
                  currentTheme === theme.name
                    ? 'border-accent-primary'
                    : 'border-light hover:border-accent-primary hover:bg-tertiary'
                }`}
                onClick={() => handleThemeSelect(theme.name)}
                whileTap={{ scale: 0.985 }}
                whileHover={{ scale: 1.015, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {/* Theme Preview */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 rounded-full border border-medium" style={{ backgroundColor: theme.lightPreview }} />
                    <div className="w-4 h-4 rounded-full border border-medium" style={{ backgroundColor: theme.darkPreview }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{theme.displayName}</h4>
                    <p className="text-xs text-secondary">{theme.description}</p>
                  </div>
                </div>

                {/* Color Palette Preview */}
                <div className="flex space-x-1">
                  {/* Real theme palette swatches */}
                  <div className="w-6 h-6 rounded border border-medium" style={{ backgroundColor: theme.lightPreview }} />
                  <div className="w-6 h-6 rounded border border-medium" style={{ backgroundColor: theme.darkPreview }} />
                  {theme.palette.map((hex) => (
                    <div key={hex} className="w-6 h-6 rounded border border-medium" style={{ backgroundColor: hex }} />
                  ))}
                </div>

                {/* Selected Indicator */}
                {currentTheme === theme.name && (
                  <motion.div
                    className="absolute top-2 right-2 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <p className="text-xs text-secondary text-center w-full">
          Themes are inspired by popular productivity apps. Changes are saved automatically.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default ThemeSelector;
