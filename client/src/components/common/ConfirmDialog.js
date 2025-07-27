import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog; 