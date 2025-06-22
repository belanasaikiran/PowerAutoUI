"use client";
import Image from "next/image";
import { useState } from "react";
import ChatWindow from "./components/ChatWindow/page";
import NavBar from "./components/NavBar/nav";
import Dashboard from "./components/Dashboard/dashboard";
import { FileProvider } from "./context/FileContext";
import FileInfo from "./components/FileInfo/FileInfo";
import ChartTitle from "./components/ChartTitle/ChartTitle";

function HomeContent() {
  const [chartData, setChartData] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [chartType, setChartType] = useState("bar");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-10 gap-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      <main className="row-start-2 w-full h-full">
        {chartData ? (
          <div className="flex flex-row h-full gap-6">
            <div className="w-[70%] flex flex-col">
              <div className="mb-4">
                <ChartTitle prompt={tableId} />
              </div>
              <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <Dashboard chartData={chartData} chartType={chartType} />
              </div>
            </div>
            <div className="w-[30%]">
              <ChatWindow 
                setChartData={setChartData} 
                setTableId={setTableId} 
                tableId={tableId}
                setChartType={setChartType} 
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="w-[600px] max-w-full rounded-xl overflow-hidden shadow-2xl">
              <ChatWindow 
                setChartData={setChartData} 
                setTableId={setTableId} 
                tableId={tableId}
                setChartType={setChartType} 
              />
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center bg-gray-900 bg-opacity-50 py-4 border-t border-gray-800">
        <a
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          WoW!
        </a>

        <a
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Dream AI Hackathon
        </a>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <FileProvider>
      <HomeContent />
    </FileProvider>
  );
}
