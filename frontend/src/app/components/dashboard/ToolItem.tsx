'use client'

import React from 'react';
import { useDrag } from 'react-dnd';

interface ToolItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const ToolItem: React.FC<ToolItemProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'chart-component',
    item: { 
      type: 'new-component',
      componentType: type,
      name: label
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`
        flex flex-col items-center justify-center 
        p-3 rounded-lg border cursor-move transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 border-blue-400 bg-blue-100' 
          : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800 hover:shadow-md'
        }
      `}
      style={{ minWidth: '80px', minHeight: '70px' }}
    >
      <div className="mb-1 text-white">
        {icon}
      </div>
      <span className="text-xs font-medium text-white text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

export default ToolItem; 