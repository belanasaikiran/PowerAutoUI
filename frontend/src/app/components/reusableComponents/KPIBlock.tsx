'use client'

import React, { useState } from 'react';

interface KPIBlockProps {
  title?: string;
  value?: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  width?: number;
  height?: number;
  onTitleChange?: (newTitle: string) => void;
  editable?: boolean;
}

const KPIBlock: React.FC<KPIBlockProps> = ({
  title = "Revenue",
  value = 125000,
  unit = "$",
  trend = "up",
  trendValue = 12.5,
  width = 300,
  height = 200,
  onTitleChange,
  editable = false
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    onTitleChange?.(currentTitle);
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="text-sm font-medium text-gray-600 bg-transparent border-b border-gray-300 outline-none flex-1"
            autoFocus
          />
        ) : (
          <h3 
            className={`text-sm font-medium text-gray-600 ${editable ? 'cursor-pointer hover:text-blue-600' : ''}`}
            onClick={() => editable && setIsEditingTitle(true)}
          >
            {currentTitle}
          </h3>
        )}
        
        <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          <span>{trendValue}%</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {unit && <span className="text-2xl">{unit}</span>}
            {formatValue(value)}
          </div>
          
          <div className="text-xs text-gray-500">
            vs last period
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-2">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Target</span>
          <span className="font-medium">
            {unit}{typeof value === 'number' ? (value * 1.1).toLocaleString() : '150,000'}
          </span>
        </div>
        <div className="mt-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(100, typeof value === 'number' ? (value / (value * 1.1)) * 100 : 83)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KPIBlock; 