// Export all reusable chart components
export { default as PieChart } from './PieChart';
export { default as BarChart } from './BarChart';
export { default as ScatterPlot } from './ScatterPlot';
export { default as MapChart } from './MapChart';
export { default as FunnelChart } from './FunnelChart';
export { default as WaterfallChart } from './WaterfallChart';
export { default as LineChart } from './LineChart';
export { default as AreaChart } from './AreaChart';
export { default as DonutChart } from './DonutChart';
export { default as StackedBarChart } from './StackedBarChart';
export { default as TableComponent } from './TableComponent';
export { default as KPIBlock } from './KPIBlock';
export { default as GaugeChart } from './GaugeChart';
export { default as TextBox } from './TextBox';
export { default as Slicer } from './Slicer';
export { default as ImageUpload } from './ImageUpload';
export { Rectangle, Circle, Arrow } from './ShapeComponents';

// Component registry for dynamic rendering
import PieChart from './PieChart';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import MapChart from './MapChart';
import FunnelChart from './FunnelChart';
import WaterfallChart from './WaterfallChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';
import DonutChart from './DonutChart';
import StackedBarChart from './StackedBarChart';
import TableComponent from './TableComponent';
import KPIBlock from './KPIBlock';
import GaugeChart from './GaugeChart';
import TextBox from './TextBox';
import Slicer from './Slicer';
import ImageUpload from './ImageUpload';
import { Rectangle, Circle, Arrow } from './ShapeComponents';

export const CHART_COMPONENTS = {
  'pie-chart': PieChart,
  'bar-chart': BarChart,
  'scatter-plot': ScatterPlot,
  'map-chart': MapChart,
  'funnel-chart': FunnelChart,
  'waterfall-chart': WaterfallChart,
  'line': LineChart,
  'area': AreaChart,
  'donut': DonutChart,
  'stacked-bar': StackedBarChart,
  'table': TableComponent,
  'kpi': KPIBlock,
  'gauge': GaugeChart,
  'textbox': TextBox,
  'slicer': Slicer,
  'image': ImageUpload,
  'rectangle': Rectangle,
  'circle': Circle,
  'arrow': Arrow
};

// Chart metadata for component information
export const CHART_METADATA = {
  'pie-chart': {
    name: 'Pie Chart',
    description: 'Display data as proportional slices of a circle',
    category: 'Distribution',
    defaultSize: { width: 400, height: 300 }
  },
  'bar-chart': {
    name: 'Bar Chart',
    description: 'Compare values across categories with rectangular bars',
    category: 'Comparison',
    defaultSize: { width: 500, height: 300 }
  },
  'line': {
    name: 'Line Chart',
    description: 'Show trends and changes over time',
    category: 'Trend',
    defaultSize: { width: 500, height: 300 }
  },
  'area': {
    name: 'Area Chart',
    description: 'Display quantitative data with filled areas',
    category: 'Trend',
    defaultSize: { width: 500, height: 300 }
  },
  'scatter-plot': {
    name: 'Scatter Plot',
    description: 'Show relationships between two numerical variables',
    category: 'Correlation',
    defaultSize: { width: 500, height: 400 }
  },
  'donut': {
    name: 'Donut Chart',
    description: 'Pie chart with a hollow center for additional information',
    category: 'Distribution',
    defaultSize: { width: 400, height: 300 }
  },
  'stacked-bar': {
    name: 'Stacked Bar Chart',
    description: 'Compare multiple data series within categories',
    category: 'Comparison',
    defaultSize: { width: 500, height: 300 }
  },
  'map-chart': {
    name: 'Map Chart',
    description: 'Display geographic data on a map visualization',
    category: 'Geographic',
    defaultSize: { width: 500, height: 400 }
  },
  'funnel-chart': {
    name: 'Funnel Chart',
    description: 'Show progressive reduction of data through stages',
    category: 'Process',
    defaultSize: { width: 400, height: 400 }
  },
  'waterfall-chart': {
    name: 'Waterfall Chart',
    description: 'Display cumulative effect of sequential values',
    category: 'Financial',
    defaultSize: { width: 500, height: 400 }
  },
  'table': {
    name: 'Data Table',
    description: 'Display structured data in rows and columns',
    category: 'Data',
    defaultSize: { width: 500, height: 300 }
  },
  'kpi': {
    name: 'KPI Block',
    description: 'Highlight key performance indicators',
    category: 'Metrics',
    defaultSize: { width: 300, height: 200 }
  },
  'gauge': {
    name: 'Gauge Chart',
    description: 'Show progress towards a target value',
    category: 'Metrics',
    defaultSize: { width: 300, height: 250 }
  },
  'textbox': {
    name: 'Text Box',
    description: 'Add custom text and annotations',
    category: 'Content',
    defaultSize: { width: 300, height: 150 }
  },
  'slicer': {
    name: 'Slicer',
    description: 'Interactive filter for data selection',
    category: 'Control',
    defaultSize: { width: 200, height: 300 }
  },
  'image': {
    name: 'Image Upload',
    description: 'Display uploaded images and media',
    category: 'Content',
    defaultSize: { width: 300, height: 200 }
  },
  'rectangle': {
    name: 'Rectangle',
    description: 'Basic rectangular shape for design',
    category: 'Shape',
    defaultSize: { width: 200, height: 100 }
  },
  'circle': {
    name: 'Circle',
    description: 'Basic circular shape for design',
    category: 'Shape',
    defaultSize: { width: 150, height: 150 }
  },
  'arrow': {
    name: 'Arrow',
    description: 'Directional arrow for flow and connections',
    category: 'Shape',
    defaultSize: { width: 200, height: 100 }
  }
}; 