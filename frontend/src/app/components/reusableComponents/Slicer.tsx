'use client'

import React, { useState } from 'react';

interface SlicerProps {
  title?: string;
  options?: string[];
  selectedOptions?: string[];
  width?: number;
  height?: number;
  onSelectionChange?: (selected: string[]) => void;
  onTitleChange?: (newTitle: string) => void;
  editable?: boolean;
  multiSelect?: boolean;
}

const Slicer: React.FC<SlicerProps> = ({
  title = "Filter Options",
  options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  selectedOptions = [],
  width = 200,
  height = 300,
  onSelectionChange,
  onTitleChange,
  editable = false,
  multiSelect = true
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selected, setSelected] = useState<string[]>(selectedOptions);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    onTitleChange?.(currentTitle);
  };

  const handleOptionClick = (option: string) => {
    let newSelected: string[];
    
    if (multiSelect) {
      if (selected.includes(option)) {
        newSelected = selected.filter(item => item !== option);
      } else {
        newSelected = [...selected, option];
      }
    } else {
      newSelected = selected.includes(option) ? [] : [option];
    }
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const clearAll = () => {
    setSelected([]);
    onSelectionChange?.([]);
  };

  const selectAll = () => {
    setSelected([...options]);
    onSelectionChange?.(options);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        {isEditingTitle ? (
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="text-sm font-semibold border border-gray-300 rounded px-2 py-1 flex-1"
            autoFocus
          />
        ) : (
          <h3 
            className={`text-sm font-semibold text-gray-800 ${editable ? 'cursor-pointer hover:text-blue-600' : ''} flex-1`}
            onClick={() => editable && setIsEditingTitle(true)}
          >
            {currentTitle}
          </h3>
        )}
      </div>

      {/* Controls */}
      {multiSelect && (
        <div className="flex gap-2 p-2 border-b border-gray-100">
          <button
            onClick={selectAll}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Options List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`
                flex items-center p-2 rounded cursor-pointer transition-colors text-sm
                ${selected.includes(option) 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
                }
              `}
            >
              <div className={`
                w-4 h-4 rounded border-2 mr-2 flex items-center justify-center
                ${selected.includes(option) 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {selected.includes(option) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="flex-1">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 text-xs text-gray-500">
        {selected.length} of {options.length} selected
      </div>
    </div>
  );
};

export default Slicer; 