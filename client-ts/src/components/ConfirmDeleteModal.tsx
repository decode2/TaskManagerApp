import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        
        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 bg-slate-800 p-6 rounded-lg max-w-sm w-full shadow-xl"
        >
          <Dialog.Title className="text-xl font-semibold text-white mb-4">Delete Task</Dialog.Title>
          <p className="text-white mb-6">
            Are you sure you want to delete <strong>{taskTitle}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>

  );
};

export default ConfirmDeleteModal;
