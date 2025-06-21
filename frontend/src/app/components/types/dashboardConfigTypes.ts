export interface DashboardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KPIConfig {
  id: string;
  type: string;
  position: DashboardPosition;
  props: {
    value: number;
    min?: number;
    max?: number;
    title: string;
    unit?: string;
    [key: string]: any;
  };
}

export interface DashboardComponentConfig {
  id: string;
  type: string;
  position: DashboardPosition;
  props: {
    data: any[];
    title: string;
    colors?: string[];
    [key: string]: any;
  };
}

export interface DashboardLayout {
  cols: number;
  rows: string | number;
}

export interface DashboardConfig {
  dashboardTitle: string;
  layout: DashboardLayout;
  kpis: KPIConfig[];
  components: DashboardComponentConfig[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    originalFileName: string;
    processedSheets: string[];
    dashboardConfig: DashboardConfig;
  };
} 