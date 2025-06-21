'use client'

import React, { useState } from 'react';

interface ShapeProps {
  width?: number;
  height?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  onColorChange?: (color: string) => void;
  editable?: boolean;
}

export const Rectangle: React.FC<ShapeProps> = ({
  width = 200,
  height = 100,
  color = '#3b82f6',
  borderColor = '#1e40af',
  borderWidth = 2,
  onColorChange,
  editable = false
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
    '#84cc16', '#f97316', '#ec4899', '#6b7280', '#000000', '#ffffff'
  ];

  const handleColorSelect = (newColor: string) => {
    setCurrentColor(newColor);
    onColorChange?.(newColor);
    setShowColorPicker(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div
        className="rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
        style={{
          width: Math.min(width, 300),
          height: Math.min(height, 200),
          backgroundColor: currentColor,
          border: `${borderWidth}px solid ${borderColor}`,
          minWidth: '100px',
          minHeight: '60px'
        }}
      />
      
      {editable && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-6 h-6 rounded border-2 border-white shadow-md"
            style={{ backgroundColor: currentColor }}
          />
          
          {showColorPicker && (
            <div className="absolute right-0 mt-2 p-2 bg-white border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => handleColorSelect(colorOption)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Circle: React.FC<ShapeProps> = ({
  width = 150,
  height = 150,
  color = '#10b981',
  borderColor = '#059669',
  borderWidth = 2,
  onColorChange,
  editable = false
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
    '#84cc16', '#f97316', '#ec4899', '#6b7280', '#000000', '#ffffff'
  ];

  const handleColorSelect = (newColor: string) => {
    setCurrentColor(newColor);
    onColorChange?.(newColor);
    setShowColorPicker(false);
  };

  const size = Math.min(width, height, 200);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div
        className="rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundColor: currentColor,
          border: `${borderWidth}px solid ${borderColor}`,
          minWidth: '80px',
          minHeight: '80px'
        }}
      />
      
      {editable && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-6 h-6 rounded border-2 border-white shadow-md"
            style={{ backgroundColor: currentColor }}
          />
          
          {showColorPicker && (
            <div className="absolute right-0 mt-2 p-2 bg-white border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => handleColorSelect(colorOption)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Arrow: React.FC<ShapeProps & { direction?: 'right' | 'left' | 'up' | 'down' }> = ({
  width = 200,
  height = 100,
  color = '#f59e0b',
  direction = 'right',
  onColorChange,
  editable = false
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
    '#84cc16', '#f97316', '#ec4899', '#6b7280', '#000000', '#ffffff'
  ];

  const handleColorSelect = (newColor: string) => {
    setCurrentColor(newColor);
    onColorChange?.(newColor);
    setShowColorPicker(false);
  };

  const getArrowPath = () => {
    const w = Math.min(width, 250);
    const h = Math.min(height, 150);
    
    switch (direction) {
      case 'right':
        return `M 10,${h/2} L ${w-30},${h/2} L ${w-30},${h/2-15} L ${w-10},${h/2} L ${w-30},${h/2+15} L ${w-30},${h/2} Z`;
      case 'left':
        return `M ${w-10},${h/2} L 30,${h/2} L 30,${h/2-15} L 10,${h/2} L 30,${h/2+15} L 30,${h/2} Z`;
      case 'up':
        return `M ${w/2},${h-10} L ${w/2},30 L ${w/2-15},30 L ${w/2},10 L ${w/2+15},30 L ${w/2},30 Z`;
      case 'down':
        return `M ${w/2},10 L ${w/2},${h-30} L ${w/2-15},${h-30} L ${w/2},${h-10} L ${w/2+15},${h-30} L ${w/2},${h-30} Z`;
      default:
        return `M 10,${h/2} L ${w-30},${h/2} L ${w-30},${h/2-15} L ${w-10},${h/2} L ${w-30},${h/2+15} L ${w-30},${h/2} Z`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg 
        width={Math.min(width, 250)} 
        height={Math.min(height, 150)}
        className="drop-shadow-md hover:drop-shadow-lg transition-all duration-200"
      >
        <path
          d={getArrowPath()}
          fill={currentColor}
          stroke="#000"
          strokeWidth="1"
        />
      </svg>
      
      {editable && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-6 h-6 rounded border-2 border-white shadow-md"
            style={{ backgroundColor: currentColor }}
          />
          
          {showColorPicker && (
            <div className="absolute right-0 mt-2 p-2 bg-white border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => handleColorSelect(colorOption)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 