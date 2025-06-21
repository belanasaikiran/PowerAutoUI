'use client'

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  width?: number;
  height?: number;
  onImageChange?: (imageUrl: string) => void;
  editable?: boolean;
  defaultImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  width = 300,
  height = 200,
  onImageChange,
  editable = false,
  defaultImageUrl
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        onImageChange?.(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    onImageChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`
          flex-1 relative border-2 border-dashed rounded-lg transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : imageUrl 
              ? 'border-gray-300' 
              : 'border-gray-400 hover:border-gray-500'
          }
          ${editable ? 'cursor-pointer' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={{ minHeight: '120px' }}
      >
        {imageUrl ? (
          <div className="w-full h-full relative">
            <img
              src={imageUrl}
              alt="Uploaded content"
              className="w-full h-full object-contain rounded-lg"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            {editable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-500">
            <svg
              className="w-12 h-12 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-center mb-2">
              {editable ? (
                <>
                  <span className="font-medium">Click to upload</span> or drag and drop
                </>
              ) : (
                'No image uploaded'
              )}
            </p>
            {editable && (
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            )}
          </div>
        )}

        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 