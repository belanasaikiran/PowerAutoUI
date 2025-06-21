// API utilities for fetching chart data

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Simulated API endpoints
const API_BASE = '/api';

// Mock data generators
export const generatePieChartData = () => [
  { label: 'Desktop', value: 45 },
  { label: 'Mobile', value: 35 },
  { label: 'Tablet', value: 20 }
];

export const generateBarChartData = () => [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 140 },
  { label: 'Mar', value: 165 },
  { label: 'Apr', value: 180 },
  { label: 'May', value: 155 },
  { label: 'Jun', value: 190 }
];

export const generateScatterPlotData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      label: `Point ${i + 1}`
    });
  }
  return data;
};

export const generateMapChartData = () => [
  { region: 'North America', value: 250 },
  { region: 'Europe', value: 180 },
  { region: 'Asia', value: 320 },
  { region: 'South America', value: 120 },
  { region: 'Africa', value: 90 },
  { region: 'Australia', value: 60 }
];

export const generateFunnelChartData = () => [
  { stage: 'Visitors', value: 10000 },
  { stage: 'Leads', value: 5000 },
  { stage: 'Prospects', value: 2500 },
  { stage: 'Customers', value: 1250 },
  { stage: 'Advocates', value: 625 }
];

export const generateWaterfallChartData = () => [
  { category: 'Initial', value: 1000, type: 'total' as const },
  { category: 'Revenue', value: 500, type: 'positive' as const },
  { category: 'Costs', value: -200, type: 'negative' as const },
  { category: 'Taxes', value: -100, type: 'negative' as const },
  { category: 'Net', value: 1200, type: 'total' as const }
];

// API functions that simulate server calls
export const fetchChartData = async (
  chartType: string, 
  filters?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Simulate occasional API failures
  if (Math.random() < 0.05) {
    return {
      success: false,
      data: [],
      message: 'Failed to fetch data'
    };
  }

  let data: any[] = [];

  switch (chartType) {
    case 'pie-chart':
      data = generatePieChartData();
      break;
    case 'bar-chart':
      data = generateBarChartData();
      break;
    case 'scatter-plot':
      data = generateScatterPlotData();
      break;
    case 'map-chart':
      data = generateMapChartData();
      break;
    case 'funnel-chart':
      data = generateFunnelChartData();
      break;
    case 'waterfall-chart':
      data = generateWaterfallChartData();
      break;
    default:
      data = [];
  }

  // Apply filters if provided
  if (filters) {
    // Simple filter implementation
    if (filters.limit) {
      data = data.slice(0, filters.limit);
    }
    if (filters.minValue) {
      data = data.filter(item => 
        item.value >= filters.minValue
      );
    }
  }

  return {
    success: true,
    data
  };
};

export const saveDashboardLayout = async (
  layout: any[]
): Promise<ApiResponse<string>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate occasional failures
  if (Math.random() < 0.1) {
    return {
      success: false,
      data: '',
      message: 'Failed to save dashboard'
    };
  }

  return {
    success: true,
    data: 'dashboard-saved-' + Date.now(),
    message: 'Dashboard saved successfully'
  };
};

export const loadDashboardLayout = async (
  dashboardId?: string
): Promise<ApiResponse<any[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    success: true,
    data: [] // Return empty layout for now
  };
};

// Real-time data updates simulation
export const subscribeToRealTimeUpdates = (
  chartId: string,
  callback: (data: any[]) => void
) => {
  const interval = setInterval(async () => {
    const chartType = chartId.split('-')[0];
    const response = await fetchChartData(chartType);
    if (response.success) {
      callback(response.data);
    }
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
};

// Export all data generators for direct use
export const dataGenerators = {
  'pie-chart': generatePieChartData,
  'bar-chart': generateBarChartData,
  'scatter-plot': generateScatterPlotData,
  'map-chart': generateMapChartData,
  'funnel-chart': generateFunnelChartData,
  'waterfall-chart': generateWaterfallChartData
}; 