import React from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl z-50 w-full max-w-sm"
      >
        <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Confirm Deletion
        </Dialog.Title>
        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete the task "<strong>{taskTitle}</strong>"? This action cannot be undone.
        </Dialog.Description>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4 py-2">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="px-4 py-2">
            Delete
          </Button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;