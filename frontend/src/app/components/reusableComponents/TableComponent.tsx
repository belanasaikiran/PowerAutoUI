'use client'

import React, { useState } from 'react';

interface TableComponentProps {
  data?: Array<Record<string, any>>;
  width?: number;
  height?: number;
  title?: string;
  onTitleChange?: (newTitle: string) => void;
  editable?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data = [
    { name: 'Product A', sales: 1200, profit: 300, region: 'North' },
    { name: 'Product B', sales: 800, profit: 150, region: 'South' },
    { name: 'Product C', sales: 1500, profit: 450, region: 'East' },
    { name: 'Product D', sales: 950, profit: 200, region: 'West' },
  ],
  width = 500,
  height = 400,
  title = "Data Table",
  onTitleChange,
  editable = false
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    onTitleChange?.(currentTitle);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        {isEditingTitle ? (
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="text-sm font-bold border border-gray-300 rounded px-2 py-1 flex-1 mr-2"
            autoFocus
          />
        ) : (
          <h3 
            className={`text-sm font-bold ${editable ? 'cursor-pointer hover:text-blue-600' : ''} flex-1`}
            onClick={() => editable && setIsEditingTitle(true)}
          >
            {currentTitle}
          </h3>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto" style={{ maxHeight: height - 60 }}>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-b"
                    >
                      {typeof row[column] === 'number' ? row[column].toLocaleString() : row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent; 