"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
} | null;

type DashboardContextType = {
  chartData: ChartData;
  setChartData: React.Dispatch<React.SetStateAction<ChartData>>;
  tableId: string | null;
  setTableId: (id: string | null) => void;
  serverOutput: string | null;
  setServerOutput: React.Dispatch<React.SetStateAction<string | null>>;
  isDataLoading: boolean;
  setIsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [chartData, setChartData] = useState<ChartData>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [serverOutput, setServerOutput] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  return (
    <DashboardContext.Provider
      value={{
        chartData,
        setChartData,
        tableId,
        setTableId,
        serverOutput,
        setServerOutput,
        isDataLoading,
        setIsDataLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}