"use client";
import React from "react";

type FileInfoProps = {
  fileName: string | null;
  onRemoveFile?: () => void;
};

export default function FileInfo({ fileName, onRemoveFile }: FileInfoProps) {
  if (!fileName) return null;

  return (
    <div className="w-full bg-gray-800 py-3 px-6 text-white rounded-md mb-4 flex items-center justify-between border-l-4 border-blue-500 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-90">
      <div className="flex items-center">
        <span className="mr-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-blue-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-sm text-blue-300 uppercase tracking-wider">Current File</span>
          <span className="font-bold text-white">{fileName}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs bg-blue-600 bg-opacity-80 rounded-full px-3 py-1 text-white font-medium shadow-inner">
          Ready for analysis
        </div>
        <button
          onClick={onRemoveFile}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Remove file"
        >
          ×
        </button>
      </div>
    </div>
  );
}