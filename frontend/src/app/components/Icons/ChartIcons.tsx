'use client'

import React from 'react';

export interface ChartIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const PieChartIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#4A90E2",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <circle cx="16" cy="16" r="12" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/>
      <path d="M16 4 L16 16 L28 16 A12 12 0 0 0 16 4" fill={color}/>
      <path d="M16 16 L4 16 A12 12 0 0 0 10.4 25.6 L16 16" fill={color} opacity="0.7"/>
      <circle cx="16" cy="16" r="2" fill="white"/>
    </svg>
  );
};

export const BarChartIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#4CAF50",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <rect x="4" y="20" width="4" height="8" fill={color} rx="1"/>
      <rect x="10" y="14" width="4" height="14" fill={color} rx="1"/>
      <rect x="16" y="10" width="4" height="18" fill={color} rx="1"/>
      <rect x="22" y="16" width="4" height="12" fill={color} rx="1"/>
      <line x1="2" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2"/>
      <line x1="2" y1="2" x2="2" y2="30" stroke={color} strokeWidth="2"/>
    </svg>
  );
};

export const ScatterPlotIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#FF6B6B",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <circle cx="8" cy="24" r="2" fill={color}/>
      <circle cx="12" cy="18" r="2" fill={color}/>
      <circle cx="16" cy="22" r="2" fill={color}/>
      <circle cx="20" cy="12" r="2" fill={color}/>
      <circle cx="24" cy="16" r="2" fill={color}/>
      <circle cx="14" cy="8" r="2" fill={color}/>
      <circle cx="26" cy="10" r="2" fill={color}/>
      <line x1="2" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2"/>
      <line x1="2" y1="2" x2="2" y2="30" stroke={color} strokeWidth="2"/>
    </svg>
  );
};

export const MapChartIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#9C27B0",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <path d="M4 8 L12 6 L20 10 L28 8 L28 24 L20 26 L12 22 L4 24 Z" 
            fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
      <path d="M12 6 L12 22" stroke={color} strokeWidth="1.5"/>
      <path d="M20 10 L20 26" stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="12" r="2" fill={color}/>
      <circle cx="22" cy="16" r="1.5" fill={color}/>
      <circle cx="10" cy="18" r="1.5" fill={color}/>
    </svg>
  );
};

export const FunnelChartIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#FF9800",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <path d="M6 4 L26 4 L22 12 L18 20 L14 28 L10 20 L6 12 Z" 
            fill={color} opacity="0.7" stroke={color} strokeWidth="2"/>
      <line x1="6" y1="12" x2="26" y2="12" stroke="white" strokeWidth="1"/>
      <line x1="10" y1="20" x2="22" y2="20" stroke="white" strokeWidth="1"/>
    </svg>
  );
};

export const WaterfallChartIcon: React.FC<ChartIconProps> = ({ 
  size = 32, 
  color = "#00BCD4",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      <rect x="4" y="14" width="4" height="14" fill={color} rx="1"/>
      <rect x="10" y="10" width="4" height="8" fill="#4CAF50" rx="1"/>
      <rect x="16" y="8" width="4" height="10" fill="#4CAF50" rx="1"/>
      <rect x="22" y="12" width="4" height="6" fill="#F44336" rx="1"/>
      <path d="M8 14 L10 10" stroke={color} strokeDasharray="2,2" strokeWidth="1.5"/>
      <path d="M14 10 L16 8" stroke={color} strokeDasharray="2,2" strokeWidth="1.5"/>
      <path d="M20 8 L22 12" stroke={color} strokeDasharray="2,2" strokeWidth="1.5"/>
      <line x1="2" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2"/>
    </svg>
  );
}; 