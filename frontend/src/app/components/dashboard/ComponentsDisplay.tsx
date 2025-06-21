'use client'

import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  PieChartIcon, 
  BarChartIcon, 
  ScatterPlotIcon, 
  MapChartIcon, 
  FunnelChartIcon, 
  WaterfallChartIcon 
} from '../Icons/ChartIcons';
import ToolItem from './ToolItem';
import {
    BarChart, LineChart, PieChart, Table, LayoutDashboard,
    Circle, Square, ArrowRight, Map, GaugeCircle, Text,
    SlidersHorizontal, Donut, AreaChart, ScatterChart, Image, Layers3
  } from 'lucide-react';

interface DraggableChartIconProps {
  type: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const DraggableChartIcon: React.FC<DraggableChartIconProps> = ({ 
  type, 
  name, 
  icon, 
  color 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'chart-component',
    item: { 
      type: 'new-component',
      componentType: type,
      name: name
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
        p-4 m-2 rounded-lg border-2 border-dashed 
        cursor-move transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
        }
      `}
      style={{ minWidth: '100px', minHeight: '80px' }}
    >
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center">
        {name}
      </span>
    </div>
  );
};

const tools = [
  { type: 'bar-chart', label: 'Bar Chart', icon: <BarChart size={28} /> },
  { type: 'stacked-bar', label: 'Stacked Bar Chart', icon: <Layers3 size={28} /> },
  { type: 'line', label: 'Line Chart', icon: <LineChart size={28} /> },
  { type: 'area', label: 'Area Chart', icon: <AreaChart size={28} /> },
  { type: 'pie-chart', label: 'Pie Chart', icon: <PieChart size={28} /> },
  { type: 'donut', label: 'Donut Chart', icon: <Donut size={28} /> },
  { type: 'scatter-plot', label: 'Scatter Chart', icon: <ScatterChart size={28} /> },
  { type: 'table', label: 'Table', icon: <Table size={28} /> },
  { type: 'kpi', label: 'KPI Block', icon: <LayoutDashboard size={28} /> },
  { type: 'rectangle', label: 'Rectangle', icon: <Square size={28} /> },
  { type: 'circle', label: 'Circle', icon: <Circle size={28} /> },
  { type: 'arrow', label: 'Arrow', icon: <ArrowRight size={28} /> },
  { type: 'map-chart', label: 'Map', icon: <Map size={28} /> },
  { type: 'gauge', label: 'Gauge', icon: <GaugeCircle size={28} /> },
  { type: 'textbox', label: 'Text Box', icon: <Text size={28} /> },
  { type: 'slicer', label: 'Slicer', icon: <SlidersHorizontal size={28} /> },
  { type: 'image', label: 'Image Upload', icon: <Image size={28} /> },
  { type: 'funnel-chart', label: 'Funnel Chart', icon: <BarChart size={28} /> },
  { type: 'waterfall-chart', label: 'Waterfall Chart', icon: <BarChart size={28} /> },
];

const ComponentsDisplay = () => {
  return (
    <div className="w-full bg-black text-white border-b border-gray-700 sticky top-0 z-10">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          Dashboard Components
        </h2>
        
        {/* Scrollable container */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
            {tools.map((tool) => (
              <ToolItem
                key={tool.type}
                label={tool.label}
                type={tool.type}
                icon={tool.icon}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-400">
          💡 Drag and drop components to the dashboard below to create your visualization
        </div>
      </div>
    </div>
  );
};

export default ComponentsDisplay;
