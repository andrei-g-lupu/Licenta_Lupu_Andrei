"use client"
import React from 'react';
import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 hover:bg-gray-100 rounded-lg transition-colors 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${className}
      `}
      title="Istoric conversații"
      aria-label="Deschide istoricul conversațiilor"
    >
      <Menu className="w-5 h-5 text-gray-600" />
    </button>
  );
};

export default MobileMenuButton; 