"use client";
import {
  Bar,
  Pie,
  Line,
  Bubble,
  Doughnut,
  Radar,
  Scatter,
  PolarArea,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  Title,
  Tooltip,
  Legend,
);

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
      <div className="flex gap-4  items-center justify-center">
        {chartData ? (
          <div className="grid grid-cols-3 bg-gray-100">
            <div>
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
            </div>
            <div>
              <Pie data={chartData} />
            </div>
            <div>
              <Line data={chartData} />
            </div>
            <div>
              <Bubble data={chartData} />
            </div>
            <div>
              <Doughnut data={chartData} />
            </div>
            <div>
              <Radar data={chartData} />
            </div>
            <div>
              <Scatter data={chartData} />
            </div>
            <div>
              <PolarArea data={chartData} />
            </div>
          </div>
        ) : (
          <div className="text-white">No data to display</div>
        )}
      </div>
    </div>
  );
}
