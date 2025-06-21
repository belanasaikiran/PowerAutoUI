'use client'

import React, { useState } from 'react';

interface TextBoxProps {
  text?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  onTextChange?: (newText: string) => void;
  editable?: boolean;
}

const TextBox: React.FC<TextBoxProps> = ({
  text = "Click to edit text",
  width = 300,
  height = 150,
  fontSize = 16,
  textAlign = 'left',
  backgroundColor = '#ffffff',
  textColor = '#374151',
  onTextChange,
  editable = false
}) => {
  const [currentText, setCurrentText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  const handleTextSubmit = () => {
    setIsEditing(false);
    onTextChange?.(currentText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
      style={{ 
        backgroundColor,
        minHeight: '100px'
      }}
    >
      {isEditing ? (
        <textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleTextSubmit}
          onKeyPress={handleKeyPress}
          className="w-full h-full resize-none outline-none bg-transparent border-none"
          style={{ 
            fontSize: `${fontSize}px`,
            textAlign,
            color: textColor,
            minHeight: '60px'
          }}
          autoFocus
          placeholder="Enter your text here..."
        />
      ) : (
        <div
          className={`w-full h-full flex items-center ${editable ? 'cursor-pointer hover:bg-gray-50' : ''} rounded p-2`}
          onClick={() => editable && setIsEditing(true)}
          style={{ 
            fontSize: `${fontSize}px`,
            textAlign,
            color: textColor
          }}
        >
          <div className="w-full">
            {currentText.split('\n').map((line, index) => (
              <div key={index} className="leading-relaxed">
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBox; 