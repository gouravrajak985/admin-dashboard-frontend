import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog = ({ isOpen, onClose, onConfirm }: LogoutDialogProps) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Dialog */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } p-6 rounded-lg shadow-xl w-[400px]`}>
          <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
          <p className="text-gray-500 mb-6">Are you sure you want to log out?</p>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 border ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-800'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
                  : 'bg-black hover:bg-gray-800'
              } text-white rounded`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;
