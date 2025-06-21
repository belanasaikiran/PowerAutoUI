"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import React from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type DashboardProps = {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  } | null;
};

export default function Dashboard({ chartData }: DashboardProps) {
  return (
    <div>
      <div className="flex gap-4 bg-gray-800 w-[1000px] h-[600px] items-center justify-center">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" as const },
                title: { display: true, text: "Dashboard Chart" },
              },
            }}
          />
        ) : (
          <div className="text-white">No data to display</div>
        )}
      </div>
    </div>
  );
}
