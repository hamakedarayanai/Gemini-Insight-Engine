
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 mr-3 text-red-400" />
        <div>
          <strong className="font-bold">An error occurred.</strong>
          <span className="block sm:inline ml-2">{message}</span>
        </div>
      </div>
    </div>
  );
};
