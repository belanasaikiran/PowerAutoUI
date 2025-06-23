"use client";
import React from "react";
import Dashboard from "../Dashboard/dashboard";
import ChartTitle from "../ChartTitle/ChartTitle";
import FileInfo from "../FileInfo/FileInfo";
import { useFile } from "../../context/FileContext";

type DashboardViewProps = {
  chartData: any;
  promptTitle: string | null;
  loading: boolean;
};

export default function DashboardView({
  chartData,
  promptTitle,
  loading,
  chartType,
}: DashboardViewProps & { chartType?: string }) {
  const { fileName } = useFile();

  return (
    <div className="w-full h-full flex flex-col">
      {fileName && (
        <FileInfo
          fileName={fileName}
          onRemoveFile={() => {
            // This will be handled by the parent component via context
          }}
        />
      )}
      {promptTitle && <ChartTitle prompt={promptTitle} />}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <span className="text-white text-lg font-semibold animate-pulse">
            Loading...
          </span>
        </div>
      )}
      <div className="flex-grow ">
        {!chartData ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-lg text-gray-400">
              Upload a CSV to generate charts
            </p>
          </div>
        ) : (
          <Dashboard chartData={chartData} chartType={chartType} />
        )}
      </div>
    </div>
  );
}
