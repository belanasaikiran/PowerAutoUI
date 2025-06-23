"use client";
import React from "react";

type ChartTitleProps = {
  prompt: string | null;
};

export default function ChartTitle({ prompt }: ChartTitleProps) {
  if (!prompt) return null;

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 py-5 px-7 text-white rounded-xl mb-5 border-l-4 border-blue-500 shadow-xl backdrop-filter backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
        <span className="mr-3 bg-blue-600 p-2 rounded-lg shadow-inner">📊</span>
        Analysis Dashboard
      </h2>
      <div className="flex items-center">
        <span className="bg-gray-800 text-blue-300 font-mono px-3 py-1 rounded-md text-sm mr-2 border border-gray-700">Table ID:</span>
        <span className="text-white font-mono bg-gray-800 px-3 py-1 rounded-md border border-gray-700">{prompt}</span>
      </div>
    </div>
  );
}