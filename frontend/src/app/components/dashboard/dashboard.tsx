'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentsDisplay from './ComponentsDisplay';
import PieChart from '../reusableComponents/PieChart';
import BarChart from '../reusableComponents/BarChart';
import ScatterPlot from '../reusableComponents/ScatterPlot';
import MapChart from '../reusableComponents/MapChart';
import FunnelChart from '../reusableComponents/FunnelChart';
import WaterfallChart from '../reusableComponents/WaterfallChart';
import LineChart from '../reusableComponents/LineChart';
import AreaChart from '../reusableComponents/AreaChart';
import DonutChart from '../reusableComponents/DonutChart';
import StackedBarChart from '../reusableComponents/StackedBarChart';
import TableComponent from '../reusableComponents/TableComponent';
import KPIBlock from '../reusableComponents/KPIBlock';
import GaugeChart from '../reusableComponents/GaugeChart';
import TextBox from '../reusableComponents/TextBox';
import Slicer from '../reusableComponents/Slicer';
import ImageUpload from '../reusableComponents/ImageUpload';
import { Rectangle, Circle, Arrow } from '../reusableComponents/ShapeComponents';
import { ComponentConfig } from '../types/dashBoardComponentTypes';
import { DashboardResponse, DashboardConfig, KPIConfig, DashboardComponentConfig } from '../types/dashboardConfigTypes';

interface DashboardCanvasProps {
  components: ComponentConfig[];
  onAddComponent: (component: ComponentConfig) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
  onDeleteComponent: (id: string) => void;
}

const DashboardCanvas: React.FC<DashboardCanvasProps> = ({
  components,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['chart-component', 'existing-component'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      
      if (offset && item.type === 'new-component') {
        // Calculate grid position based on existing components
        const gridPosition = calculateGridPosition(components);
        
        const newComponent: ComponentConfig = {
          id: `${item.componentType}-${Date.now()}`,
          type: item.componentType,
          name: item.name,
          props: {
            data: getDefaultData(item.componentType),
            editable: true
          },
          position: gridPosition,
          size: {
            width: 350,
            height: 250
          }
        };
        onAddComponent(newComponent);
      } else if (item.type === 'existing-component' && offset) {
        // Handle moving existing components
        onUpdateComponent(item.id, {
          position: {
            x: Math.max(0, offset.x - 200),
            y: Math.max(0, offset.y - 150)
          }
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Function to calculate grid position for new components
  const calculateGridPosition = (existingComponents: ComponentConfig[]) => {
    const containerWidth = window.innerWidth - 140; // Account for margins and padding
    const componentWidth = 350;
    const componentHeight = 250;
    const gap = 20;
    
    const componentsPerRow = Math.max(1, Math.floor(containerWidth / (componentWidth + gap)));
    const currentCount = existingComponents.length;
    
    const row = Math.floor(currentCount / componentsPerRow);
    const col = currentCount % componentsPerRow;
    
    return {
      x: col * (componentWidth + gap) + gap,
      y: row * (componentHeight + gap) + gap
    };
  };

  const renderComponent = (config: ComponentConfig) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: 'existing-component',
      item: { 
        id: config.id,
        type: 'existing-component'
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, dropRef] = useDrop({
      accept: 'existing-component',
      drop: (item: any, monitor) => {
        if (item.id !== config.id) {
          const offset = monitor.getClientOffset();
          if (offset) {
            onUpdateComponent(item.id, {
              position: {
                x: Math.max(0, offset.x - 200),
                y: Math.max(0, offset.y - 150)
              }
            });
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
      <div
        key={config.id}
        ref={(node) => {
          dragRef(node);
          dropRef(node);
        }}
        className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 cursor-move transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 ${
          isDragging ? 'opacity-50 z-50 scale-110 rotate-2 shadow-2xl' : 'z-10 hover:z-20'
        }`}
        style={{
          left: config.position.x,
          top: config.position.y,
          width: Math.max(config.size.width, 350), // Minimum width to prevent shrinking
          height: Math.max(config.size.height, 250), // Minimum height to prevent shrinking
          minWidth: '350px',
          minHeight: '250px',
          animation: isDragging ? 'none' : 'slideIn 0.5s ease-out',
        }}
      >
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDeleteComponent(config.id);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className="w-7 h-7 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-all duration-200 hover:scale-110 shadow-md cursor-pointer relative z-30"
            style={{ pointerEvents: 'auto' }}
          >
            ×
          </button>
        </div>
        <div 
          className="w-full h-full overflow-hidden" 
          style={{ 
            padding: '8px', 
            paddingTop: '36px',
            minWidth: '342px', // Account for padding
            minHeight: '242px'  // Account for padding
          }}
        >
          {children}
        </div>
      </div>
    );

    const handleTitleChange = (newTitle: string) => {
      onUpdateComponent(config.id, { name: newTitle });
    };

    const handleColorChange = (colors: string[]) => {
      onUpdateComponent(config.id, { 
        props: { ...config.props, colors } 
      });
    };

    const handleShapeColorChange = (color: string) => {
      onUpdateComponent(config.id, { 
        props: { ...config.props, color } 
      });
    };

    const commonProps = {
      data: [],
      ...config.props,
      onTitleChange: handleTitleChange,
      onColorChange: handleColorChange,
      title: config.name,
      width: Math.max(config.size.width - 16, 334), // Ensure minimum chart width
      height: Math.max(config.size.height - 44, 206) // Ensure minimum chart height
    };

    const shapeProps = {
      ...config.props,
      onColorChange: handleShapeColorChange,
      width: Math.max(config.size.width - 16, 334),
      height: Math.max(config.size.height - 44, 206),
      editable: true
    };

    switch (config.type) {
      case 'pie-chart':
        return (
          <ComponentWrapper>
            <PieChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'bar-chart':
        return (
          <ComponentWrapper>
            <BarChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'line':
        return (
          <ComponentWrapper>
            <LineChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'area':
        return (
          <ComponentWrapper>
            <AreaChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'donut':
        return (
          <ComponentWrapper>
            <DonutChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'stacked-bar':
        return (
          <ComponentWrapper>
            <StackedBarChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'scatter-plot':
        return (
          <ComponentWrapper>
            <ScatterPlot {...commonProps} />
          </ComponentWrapper>
        );
      case 'table':
        return (
          <ComponentWrapper>
            <TableComponent {...commonProps} />
          </ComponentWrapper>
        );
      case 'kpi':
        return (
          <ComponentWrapper>
            <KPIBlock {...commonProps} />
          </ComponentWrapper>
        );
      case 'gauge':
        return (
          <ComponentWrapper>
            <GaugeChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'textbox':
        return (
          <ComponentWrapper>
            <TextBox {...commonProps} />
          </ComponentWrapper>
        );
      case 'slicer':
        return (
          <ComponentWrapper>
            <Slicer {...commonProps} />
          </ComponentWrapper>
        );
      case 'image':
        return (
          <ComponentWrapper>
            <ImageUpload {...commonProps} />
          </ComponentWrapper>
        );
      case 'rectangle':
        return (
          <ComponentWrapper>
            <Rectangle {...shapeProps} />
          </ComponentWrapper>
        );
      case 'circle':
        return (
          <ComponentWrapper>
            <Circle {...shapeProps} />
          </ComponentWrapper>
        );
      case 'arrow':
        return (
          <ComponentWrapper>
            <Arrow {...shapeProps} />
          </ComponentWrapper>
        );
      case 'map-chart':
        return (
          <ComponentWrapper>
            <MapChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'funnel-chart':
        return (
          <ComponentWrapper>
            <FunnelChart {...commonProps} />
          </ComponentWrapper>
        );
      case 'waterfall-chart':
        return (
          <ComponentWrapper>
            <WaterfallChart {...commonProps} />
          </ComponentWrapper>
        );
      default:
        return null;
    }
  };

  // Calculate minimum height needed for all components
  const calculateMinHeight = () => {
    if (components.length === 0) return 600; // Minimum height for empty state
    
    const containerWidth = window.innerWidth - 140; // Account for margins and padding
    const componentWidth = 370; // 350 + 20 gap
    const componentHeight = 270; // 250 + 20 gap
    const gap = 20;
    
    const componentsPerRow = Math.max(1, Math.floor(containerWidth / componentWidth));
    const rows = Math.ceil(components.length / componentsPerRow);
    const totalHeight = rows * componentHeight + gap * 2; // Add padding at top and bottom
    
    return Math.max(totalHeight, 600); // Ensure minimum height
  };

  return (
    <div
      ref={drop as any}
      className={`
        relative w-full bg-gray-50 p-4 scroll-smooth transition-all duration-300
        ${isOver ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-inner' : 'border border-gray-200'}
      `}
      style={{ 
        height: `${calculateMinHeight()}px`,
        minHeight: `${calculateMinHeight()}px`,
        overflowY: 'visible', // Allow content to extend beyond container
        overflowX: 'hidden',
        scrollBehavior: 'smooth'
      }}
    >
      {components.length === 0 ? (
        <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: '400px' }}>
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4 animate-bounce">📊</div>
            <h3 className="text-xl font-semibold mb-2 animate-slide-up">Start Building Your Dashboard</h3>
            <p className="text-sm animate-slide-up animation-delay-200">Drag and drop chart components from above to get started</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full" style={{ minHeight: `${calculateMinHeight() - 32}px` }}>
          {components.map(renderComponent)}
        </div>
      )}
    </div>
  );
};

// Mock API function to simulate data fetching
const fetchChartData = async (chartType: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getDefaultData(chartType);
};

// Generated Dashboard Component
const GeneratedDashboard: React.FC<{ config: DashboardConfig }> = ({ config }) => {
  const renderComponent = (component: DashboardComponentConfig | KPIConfig) => {
    const { id, type, position, props } = component;
    
    // Convert grid position to pixel position (approximate)
    const pixelPosition = {
      x: (position.x * 100) + 20, // Approximate grid to pixel conversion
      y: (position.y * 100) + 20,
    };
    
    const pixelSize = {
      width: position.width * 100,
      height: position.height * 100,
    };

    const baseProps = {
      width: pixelSize.width - 16,
      height: pixelSize.height - 44,
      editable: false, // Generated components are not editable
    };

    // Type guard to check if component has data property
    const hasData = (props: any): props is DashboardComponentConfig['props'] => 'data' in props;
    
    let ComponentToRender = null;

    switch (type) {
      case 'AreaChart':
        if (hasData(props)) ComponentToRender = <AreaChart {...baseProps} {...props} />;
        break;
      case 'BarChart':
        if (hasData(props)) ComponentToRender = <BarChart {...baseProps} {...props} />;
        break;
      case 'GaugeChart':
        ComponentToRender = <GaugeChart {...baseProps} {...(props as any)} />;
        break;
      case 'PieChart':
        if (hasData(props)) ComponentToRender = <PieChart {...baseProps} {...props} />;
        break;
      case 'LineChart':
        if (hasData(props)) ComponentToRender = <LineChart {...baseProps} {...props} />;
        break;
      case 'DonutChart':
        if (hasData(props)) ComponentToRender = <DonutChart {...baseProps} {...props} />;
        break;
      case 'StackedBarChart':
        if (hasData(props)) ComponentToRender = <StackedBarChart {...baseProps} {...props} />;
        break;
      case 'ScatterPlot':
        if (hasData(props)) ComponentToRender = <ScatterPlot {...baseProps} {...props} />;
        break;
      case 'TableComponent':
        if (hasData(props)) ComponentToRender = <TableComponent {...baseProps} {...props} />;
        break;
      case 'KPIBlock':
        ComponentToRender = <KPIBlock {...baseProps} {...(props as any)} />;
        break;
      default:
        console.warn(`Unknown component type: ${type}`);
        return null;
    }

    return (
      <div
        key={id}
        className="absolute bg-white rounded-lg shadow-lg border border-gray-200"
        style={{
          left: pixelPosition.x,
          top: pixelPosition.y,
          width: pixelSize.width,
          height: pixelSize.height,
          minWidth: '300px',
          minHeight: '200px',
        }}
      >
        <div 
          className="w-full h-full overflow-hidden" 
          style={{ 
            padding: '8px', 
            paddingTop: '8px',
          }}
        >
          {ComponentToRender}
        </div>
      </div>
    );
  };

  // Calculate minimum height needed for all components
  const calculateMinHeight = () => {
    let maxY = 0;
    [...config.kpis, ...config.components].forEach(component => {
      const bottom = (component.position.y + component.position.height) * 100;
      maxY = Math.max(maxY, bottom);
    });
    return Math.max(maxY + 100, 600); // Add padding and ensure minimum height
  };

  return (
    <div
      className="relative w-full bg-gray-50 p-4 scroll-smooth"
      style={{ 
        height: `${calculateMinHeight()}px`,
        minHeight: `${calculateMinHeight()}px`,
        overflowY: 'visible',
        overflowX: 'hidden',
      }}
    >
      {/* Dashboard Title */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{config.dashboardTitle}</h2>
      </div>
      
      {/* Render KPIs */}
      {config.kpis.map(renderComponent)}
      
      {/* Render Components */}
      {config.components.map(renderComponent)}
    </div>
  );
};

// Function to get default data for different component types
const getDefaultData = (componentType: string) => {
  switch (componentType) {
    case 'pie-chart':
      return [
        { label: 'Desktop', value: 45 },
        { label: 'Mobile', value: 35 },
        { label: 'Tablet', value: 20 },
      ];
    case 'bar-chart':
      return [
        { category: 'Jan', value: 65 },
        { category: 'Feb', value: 80 },
        { category: 'Mar', value: 75 },
        { category: 'Apr', value: 90 },
        { category: 'May', value: 85 },
        { category: 'Jun', value: 95 },
      ];
    case 'line':
      return [
        { x: 'Jan', y: 65, series: 'Sales' },
        { x: 'Feb', y: 80, series: 'Sales' },
        { x: 'Mar', y: 75, series: 'Sales' },
        { x: 'Apr', y: 90, series: 'Sales' },
        { x: 'May', y: 85, series: 'Sales' },
        { x: 'Jun', y: 95, series: 'Sales' },
      ];
    case 'area':
      return [
        { x: 'Jan', y: 65, series: 'Revenue' },
        { x: 'Feb', y: 80, series: 'Revenue' },
        { x: 'Mar', y: 75, series: 'Revenue' },
        { x: 'Apr', y: 90, series: 'Revenue' },
        { x: 'May', y: 85, series: 'Revenue' },
        { x: 'Jun', y: 95, series: 'Revenue' },
      ];
    case 'donut':
      return [
        { label: 'Desktop', value: 45 },
        { label: 'Mobile', value: 35 },
        { label: 'Tablet', value: 20 },
      ];
    case 'stacked-bar':
      return [
        { category: 'Q1', Sales: 120, Marketing: 80, Support: 40 },
        { category: 'Q2', Sales: 150, Marketing: 90, Support: 50 },
        { category: 'Q3', Sales: 180, Marketing: 100, Support: 60 },
        { category: 'Q4', Sales: 200, Marketing: 110, Support: 70 },
      ];
    case 'scatter-plot':
      return [
        { x: 10, y: 20, label: 'Point 1' },
        { x: 25, y: 35, label: 'Point 2' },
        { x: 40, y: 15, label: 'Point 3' },
        { x: 55, y: 45, label: 'Point 4' },
        { x: 70, y: 30, label: 'Point 5' },
      ];
    case 'table':
      return [
        { name: 'Product A', sales: 1200, profit: 300, region: 'North' },
        { name: 'Product B', sales: 800, profit: 150, region: 'South' },
        { name: 'Product C', sales: 1500, profit: 450, region: 'East' },
        { name: 'Product D', sales: 950, profit: 200, region: 'West' },
      ];
    case 'map-chart':
      return [
        { region: 'North America', value: 150, coordinates: [250, 150] },
        { region: 'Europe', value: 120, coordinates: [300, 120] },
        { region: 'Asia', value: 200, coordinates: [380, 140] },
        { region: 'South America', value: 80, coordinates: [220, 280] },
      ];
    case 'funnel-chart':
      return [
        { stage: 'Awareness', value: 1000 },
        { stage: 'Interest', value: 800 },
        { stage: 'Consideration', value: 600 },
        { stage: 'Purchase', value: 400 },
        { stage: 'Retention', value: 200 },
      ];
    case 'waterfall-chart':
      return [
        { category: 'Starting', value: 100, type: 'total' as const },
        { category: 'Sales', value: 50, type: 'positive' as const },
        { category: 'Marketing', value: -20, type: 'negative' as const },
        { category: 'Operations', value: -15, type: 'negative' as const },
        { category: 'Total', value: 115, type: 'total' as const }
      ];
    case 'slicer':
      return {
        options: ["All Products", "Electronics", "Clothing", "Books", "Home & Garden"],
        selectedOptions: ["All Products"]
      };
    case 'kpi':
    case 'gauge':
    case 'textbox':
    case 'image':
      return {}; // These components don't need data arrays
    default:
      return [];
  }
};

const Dashboard: React.FC = () => {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [showGeneratedDashboard, setShowGeneratedDashboard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to reorganize components in grid layout
  const reorganizeLayout = useCallback(() => {
    if (components.length === 0) return;
    
    const containerWidth = window.innerWidth - 140; // Account for margins and padding
    const componentWidth = 350;
    const componentHeight = 250;
    const gap = 20;
    
    const componentsPerRow = Math.max(1, Math.floor(containerWidth / (componentWidth + gap)));
    
    const reorganizedComponents = components.map((component, index) => {
      const row = Math.floor(index / componentsPerRow);
      const col = index % componentsPerRow;
      
      return {
        ...component,
        position: {
          x: col * (componentWidth + gap) + gap,
          y: row * (componentHeight + gap) + gap
        }
      };
    });
    
    setComponents(reorganizedComponents);
  }, [components]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      reorganizeLayout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reorganizeLayout]);

  // Simulate initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    
    loadInitialData();
  }, []);

  const handleAddComponent = useCallback(async (component: ComponentConfig) => {
    setLoading(true);
    try {
      // Simulate API call to fetch fresh data
      const freshData = await fetchChartData(component.type);
      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          data: freshData
        }
      };
      setComponents(prev => [...prev, updatedComponent]);
    } catch (error) {
      console.error('Failed to add component:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateComponent = useCallback((id: string, updates: Partial<ComponentConfig>) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  }, []);

  const handleDeleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  }, []);

  const clearDashboard = useCallback(() => {
    setComponents([]);
    setDashboardConfig(null);
    setShowGeneratedDashboard(false);
  }, []);

  const saveDashboard = async () => {
    setLoading(true);
    try {
      // Simulate API call to save dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Dashboard saved successfully!');
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      alert('Failed to save dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await fetch('http://localhost:8000/generate-dashboard-config', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse: DashboardResponse = await response.json();
      console.log('Dashboard: Received config:', jsonResponse);
      
      if (jsonResponse.success && jsonResponse.data.dashboardConfig) {
        setDashboardConfig(jsonResponse.data.dashboardConfig);
        setShowGeneratedDashboard(true);
        
        // Clear existing components when showing generated dashboard
        setComponents([]);
      } else {
        throw new Error(jsonResponse.message || 'Failed to generate dashboard configuration');
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to generate dashboard. Please try again.');
    } finally {
      setUploadLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const switchToComponentView = () => {
    setShowGeneratedDashboard(false);
    setDashboardConfig(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen flex flex-col bg-gray-100 overflow-hidden">
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          .animate-slide-up {
            animation: slideUp 0.5s ease-out;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: both;
          }

          .upload-spinner {
            animation: spin 1s linear infinite;
          }
          
          /* Custom scrollbar */
          .dashboard-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .dashboard-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .dashboard-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          
          .dashboard-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 z-30">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Analytics Dashboard
            </h1>
            <div className="flex gap-2">
              {showGeneratedDashboard && (
                <button
                  onClick={switchToComponentView}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-all duration-200 hover:scale-105"
                >
                  Switch to Components
                </button>
              )}
              <button
                onClick={handleUploadClick}
                disabled={uploadLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full upload-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    📊 Upload Excel
                  </>
                )}
              </button>
              <button
                onClick={clearDashboard}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                disabled={components.length === 0 && !showGeneratedDashboard}
              >
                Clear All
              </button>
              <button
                onClick={saveDashboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                disabled={components.length === 0 && !showGeneratedDashboard}
              >
                Save Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Components Display Bar - Only show when not displaying generated dashboard */}
        {!showGeneratedDashboard && (
          <div className="flex-shrink-0 z-20">
            <ComponentsDisplay />
          </div>
        )}

                {/* Dashboard Container */}
        <div className="flex-1 bg-white m-4 rounded-lg shadow-lg border border-gray-200 overflow-auto">
          <div className="w-full h-full dashboard-container" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
            {showGeneratedDashboard && dashboardConfig ? (
              <GeneratedDashboard config={dashboardConfig} />
            ) : (
              <DashboardCanvas
                components={components}
                onAddComponent={handleAddComponent}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
