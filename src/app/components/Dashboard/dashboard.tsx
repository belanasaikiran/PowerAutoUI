//kaushik
// "use client";
// import {
//   Bar,
//   Pie,
//   Line,
//   Bubble,
//   Doughnut,
//   Radar,
//   Scatter,
//   PolarArea,
// } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale,
//   PolarAreaController,
//   RadarController,
//   ScatterController,
//   BubbleController,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import React from "react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale,
//   PolarAreaController,
//   RadarController,
//   ScatterController,
//   BubbleController,
//   Title,
//   Tooltip,
//   Legend,
// );

// type DashboardProps = {
//   chartData: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor?: string | string[];
//       borderColor?: string | string[];
//       borderWidth?: number;
//     }[];
//   } | null;
//   chartType?: string;
// };

// export default function Dashboard({ chartData, chartType = "bar" }: DashboardProps) {
//   const [activeCharts, setActiveCharts] = React.useState<string[]>([chartType || "bar"]);
//   const [dragging, setDragging] = React.useState<string | null>(null);
  
//   // Chart type icons for the palette
//   const chartIcons = {
//     bar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <rect x="4" y="8" width="4" height="12" rx="1" fill="currentColor" />
//       <rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
//       <rect x="16" y="12" width="4" height="8" rx="1" fill="currentColor" />
//     </svg>,
//     pie: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM19.93 11H13V4.07C16.61 4.55 19.45 7.39 19.93 11ZM4 12C4 7.93 7.06 4.56 11 4.07V19.93C7.06 19.44 4 16.07 4 12ZM13 19.93V13H19.93C19.44 16.95 16.95 19.44 13 19.93Z" fill="currentColor" />
//     </svg>,
//     line: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M3 16L8 11L13 16L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M16 8H21V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>,
//     doughnut: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
//       <circle cx="12" cy="12" r="4" fill="currentColor" />
//     </svg>,
//     radar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M12 2L15 12L12 22" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M12 2L9 12L12 22" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M2 12L12 12L22 12" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M2.63623 7L12.0001 12L21.364 7" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M2.63623 17L12.0001 12L21.364 17" stroke="currentColor" strokeWidth="1.5" />
//     </svg>,
//     polarArea: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M12 2V12L17 6" fill="currentColor" />
//       <path d="M12 12L20 14" fill="currentColor" />
//       <path d="M12 12L10 21" fill="currentColor" />
//       <path d="M12 12L3 10" fill="currentColor" />
//     </svg>,
//     bubble: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="7" cy="14" r="3" fill="currentColor" fillOpacity="0.7" />
//       <circle cx="14" cy="8" r="5" fill="currentColor" fillOpacity="0.5" />
//       <circle cx="18" cy="16" r="4" fill="currentColor" fillOpacity="0.6" />
//     </svg>,
//     scatter: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="6" cy="6" r="1.5" fill="currentColor" />
//       <circle cx="18" cy="12" r="1.5" fill="currentColor" />
//       <circle cx="10" cy="16" r="1.5" fill="currentColor" />
//       <circle cx="15" cy="5" r="1.5" fill="currentColor" />
//       <circle cx="5" cy="14" r="1.5" fill="currentColor" />
//       <circle cx="19" cy="18" r="1.5" fill="currentColor" />
//       <circle cx="12" cy="9" r="1.5" fill="currentColor" />
//     </svg>
//   };

//   // Handle dropping a chart into the main display area
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const chartType = e.dataTransfer.getData("chartType");
//     if (chartType && !activeCharts.includes(chartType)) {
//       setActiveCharts(prev => [...prev, chartType]);
//     }
//     setDragging(null);
//   };
  
//   // Allow dragging a chart from the palette
//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, chartType: string) => {
//     e.dataTransfer.setData("chartType", chartType);
//     setDragging(chartType);
//   };

//   // Render a specific chart based on type
//   const renderChart = (type: string) => {
//     switch(type.toLowerCase()) {
//       case 'bar':
//         return (
//           <Bar 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Bar Chart", color: '#fff' },
//               },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
//                 y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
//               }
//             }}
//           />
//         );
//       case 'pie':
//         return (
//           <Pie 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Pie Chart", color: '#fff' },
//               },
//             }}
//           />
//         );
//       case 'line':
//         return (
//           <Line 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Line Chart", color: '#fff' },
//               },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
//                 y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
//               }
//             }}
//           />
//         );
//       case 'doughnut':
//         return (
//           <Doughnut 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Doughnut Chart", color: '#fff' },
//               },
//             }}
//           />
//         );
//       case 'radar':
//         return (
//           <Radar 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Radar Chart", color: '#fff' },
//               },
//               scales: {
//                 r: { 
//                   grid: { color: 'rgba(255,255,255,0.1)' }, 
//                   angleLines: { color: 'rgba(255,255,255,0.1)' },
//                   ticks: { color: '#fff', backdropColor: 'transparent' }
//                 }
//               }
//             }}
//           />
//         );
//       case 'polararea':
//         return (
//           <PolarArea 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Polar Area Chart", color: '#fff' },
//               },
//               scales: {
//                 r: { 
//                   grid: { color: 'rgba(255,255,255,0.1)' }, 
//                   angleLines: { color: 'rgba(255,255,255,0.1)' },
//                   ticks: { color: '#fff', backdropColor: 'transparent' }
//                 }
//               }
//             }}
//           />
//         );
//       case 'bubble':
//         return (
//           <Bubble 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Bubble Chart", color: '#fff' },
//               },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
//                 y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
//               }
//             }}
//           />
//         );
//       case 'scatter':
//         return (
//           <Scatter 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Scatter Chart", color: '#fff' },
//               },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
//                 y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
//               }
//             }}
//           />
//         );
//       default:
//         return (
//           <Bar 
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: "top" as const, labels: { color: '#fff' } },
//                 title: { display: true, text: "Bar Chart", color: '#fff' },
//               },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
//                 y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
//               }
//             }}
//           />
//         );
//     }
//   };

//   return (
//     <div className="flex flex-col w-full gap-4">
//       {chartData ? (
//         <>
//           {/* Chart Palette */}
//           <div className="flex gap-3 p-3 bg-gray-800 rounded-lg shadow-lg overflow-x-auto border border-gray-700">
//             {Object.entries(chartIcons).map(([type, icon]) => (
//               <div
//                 key={type}
//                 draggable={!activeCharts.includes(type)}
//                 onDragStart={(e) => handleDragStart(e, type)}
//                 className={`
//                   flex flex-col items-center justify-center p-3 rounded-md cursor-grab
//                   ${activeCharts.includes(type) 
//                     ? 'bg-gray-700 opacity-40 cursor-not-allowed border border-gray-600' 
//                     : 'bg-gray-900 hover:bg-blue-900 shadow-md hover:shadow-lg border border-gray-700 hover:border-blue-500'}
//                   ${dragging === type ? 'opacity-60 scale-95' : ''}
//                   transition-all duration-200 text-white
//                 `}
//               >
//                 <div className="text-blue-400 mb-2">{icon}</div>
//                 <div className="text-xs font-medium text-gray-300 capitalize">{type}</div>
//               </div>
//             ))}
//           </div>
          
//           {/* Chart Display Area */}
//           <div 
//             className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-900 rounded-lg min-h-[500px] border border-gray-700"
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={handleDrop}
//           >
//             {activeCharts.map(chartType => (
//               <div 
//                 key={chartType} 
//                 className="bg-gray-800 rounded-lg shadow-lg p-3 relative border border-gray-700 hover:border-blue-500 transition-colors h-[300px] flex items-center justify-center"
//               >
//                 <button 
//                   onClick={() => setActiveCharts(prev => prev.filter(t => t !== chartType))}
//                   className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
//                 >
//                   ×
//                 </button>
//                 {renderChart(chartType)}
//               </div>
//             ))}
//             {activeCharts.length === 0 && (
//               <div className="col-span-full flex items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
//                 <p className="text-gray-400">Drag charts from the palette to add them here</p>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
//           <p className="text-gray-400">No data available</p>
//         </div>
//       )}
//     </div>
//   );
// }



//cow

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
import { FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaStop } from "react-icons/fa";

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
  chartType?: string;
};

export default function Dashboard({ chartData, chartType = "bar" }: DashboardProps) {
  const [activeCharts, setActiveCharts] = React.useState<string[]>([chartType || "bar"]);
  const [dragging, setDragging] = React.useState<string | null>(null);
  
  //kaushik - START: Text-to-Speech States
  const [isGeneratingAudio, setIsGeneratingAudio] = React.useState(false);
  const [audioExplanation, setAudioExplanation] = React.useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [currentAudio, setCurrentAudio] = React.useState<HTMLAudioElement | null>(null);
  //kaushik - END: Text-to-Speech States
  
  //kaushik - START: Text-to-Speech Functions
  // Generate audio explanation for dashboard
  const generateDashboardAudio = async () => {
    if (!chartData || activeCharts.length === 0) {
      alert('No charts to explain. Please add some charts first.');
      return;
    }
    
    setIsGeneratingAudio(true);
    try {
      const dashboardConfig = {
        chartTypes: activeCharts,
        chartData: chartData,
        activeCharts: activeCharts.length,
        timestamp: new Date().toISOString()
      };

      const response = await fetch("http://localhost:4000/api/generate-audio-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dashboardConfig: dashboardConfig,
          voiceId: 'pNInz6obpgDQGcFmaJgB'
        })
      });

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.audioBase64) {
        setAudioExplanation(result.explanation);
        
        // Create audio element
        const audioBlob = new Blob([
          Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => setIsPlayingAudio(true);
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
          alert('Error playing audio');
        };
        
        setCurrentAudio(audio);
        console.log('Audio explanation generated successfully');
      }
    } catch (error) {
      console.error("Failed to generate audio explanation:", error);
      alert(`Audio explanation failed: ${error.message}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Audio playback controls
  const playAudio = () => {
    if (currentAudio && !isPlayingAudio) {
      currentAudio.play();
    }
  };

  const pauseAudio = () => {
    if (currentAudio && isPlayingAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };
  //kaushik - END: Text-to-Speech Functions
  const chartIcons = {
    bar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="16" y="12" width="4" height="8" rx="1" fill="currentColor" />
    </svg>,
    pie: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM19.93 11H13V4.07C16.61 4.55 19.45 7.39 19.93 11ZM4 12C4 7.93 7.06 4.56 11 4.07V19.93C7.06 19.44 4 16.07 4 12ZM13 19.93V13H19.93C19.44 16.95 16.95 19.44 13 19.93Z" fill="currentColor" />
    </svg>,
    line: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 16L8 11L13 16L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8H21V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    doughnut: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>,
    radar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2L15 12L12 22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2L9 12L12 22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12L12 12L22 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.63623 7L12.0001 12L21.364 7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.63623 17L12.0001 12L21.364 17" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    polarArea: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2V12L17 6" fill="currentColor" />
      <path d="M12 12L20 14" fill="currentColor" />
      <path d="M12 12L10 21" fill="currentColor" />
      <path d="M12 12L3 10" fill="currentColor" />
    </svg>,
    bubble: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="14" r="3" fill="currentColor" fillOpacity="0.7" />
      <circle cx="14" cy="8" r="5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="18" cy="16" r="4" fill="currentColor" fillOpacity="0.6" />
    </svg>,
    scatter: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
      <circle cx="10" cy="16" r="1.5" fill="currentColor" />
      <circle cx="15" cy="5" r="1.5" fill="currentColor" />
      <circle cx="5" cy="14" r="1.5" fill="currentColor" />
      <circle cx="19" cy="18" r="1.5" fill="currentColor" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    </svg>
  };

  // Handle dropping a chart into the main display area
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const chartType = e.dataTransfer.getData("chartType");
    if (chartType && !activeCharts.includes(chartType)) {
      setActiveCharts(prev => [...prev, chartType]);
    }
    setDragging(null);
  };
  
  // Allow dragging a chart from the palette
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, chartType: string) => {
    e.dataTransfer.setData("chartType", chartType);
    setDragging(chartType);
  };

  // Render a specific chart based on type
  const renderChart = (type: string) => {
    switch(type.toLowerCase()) {
      case 'bar':
        return (
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Bar Chart", color: '#fff' },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
              }
            }}
          />
        );
      case 'pie':
        return (
          <Pie 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Pie Chart", color: '#fff' },
              },
            }}
          />
        );
      case 'line':
        return (
          <Line 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Line Chart", color: '#fff' },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
              }
            }}
          />
        );
      case 'doughnut':
        return (
          <Doughnut 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Doughnut Chart", color: '#fff' },
              },
            }}
          />
        );
      case 'radar':
        return (
          <Radar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Radar Chart", color: '#fff' },
              },
              scales: {
                r: { 
                  grid: { color: 'rgba(255,255,255,0.1)' }, 
                  angleLines: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: '#fff', backdropColor: 'transparent' }
                }
              }
            }}
          />
        );
      case 'polararea':
        return (
          <PolarArea 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Polar Area Chart", color: '#fff' },
              },
              scales: {
                r: { 
                  grid: { color: 'rgba(255,255,255,0.1)' }, 
                  angleLines: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: '#fff', backdropColor: 'transparent' }
                }
              }
            }}
          />
        );
      case 'bubble':
        return (
          <Bubble 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Bubble Chart", color: '#fff' },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
              }
            }}
          />
        );
      case 'scatter':
        return (
          <Scatter 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Scatter Chart", color: '#fff' },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
              }
            }}
          />
        );
      default:
        return (
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" as const, labels: { color: '#fff' } },
                title: { display: true, text: "Bar Chart", color: '#fff' },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
              }
            }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {chartData ? (
        <>
          {/* Chart Palette */}
          <div className="flex gap-3 p-3 bg-gray-800 rounded-lg shadow-lg overflow-x-auto border border-gray-700">
            {Object.entries(chartIcons).map(([type, icon]) => (
              <div
                key={type}
                draggable={!activeCharts.includes(type)}
                onDragStart={(e) => handleDragStart(e, type)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-md cursor-grab
                  ${activeCharts.includes(type) 
                    ? 'bg-gray-700 opacity-40 cursor-not-allowed border border-gray-600' 
                    : 'bg-gray-900 hover:bg-blue-900 shadow-md hover:shadow-lg border border-gray-700 hover:border-blue-500'}
                  ${dragging === type ? 'opacity-60 scale-95' : ''}
                  transition-all duration-200 text-white
                `}
              >
                <div className="text-blue-400 mb-2">{icon}</div>
                <div className="text-xs font-medium text-gray-300 capitalize">{type}</div>
              </div>
            ))}
          </div>

          {/*kaushik - START: Audio Controls Panel*/}
          {activeCharts.length > 0 && (
            <div className="flex gap-2 p-3 bg-gray-800 rounded-lg border border-purple-700">
              <div className="flex items-center gap-2 text-gray-300 text-sm mr-4">
                <FaVolumeUp className="text-purple-400" />
                <span>Audio Explanation:</span>
              </div>
              
              <button
                onClick={generateDashboardAudio}
                disabled={isGeneratingAudio || !chartData}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                title="Generate audio explanation of charts"
              >
                {isGeneratingAudio ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaVolumeUp className="w-3 h-3" />
                    Generate Audio
                  </>
                )}
              </button>

              {currentAudio && !isGeneratingAudio && (
                <>
                  <button
                    onClick={playAudio}
                    disabled={isPlayingAudio}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                    title="Play audio explanation"
                  >
                    <FaPlay className="w-3 h-3" />
                    Play
                  </button>
                  
                  <button
                    onClick={pauseAudio}
                    disabled={!isPlayingAudio}
                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                    title="Pause audio"
                  >
                    <FaPause className="w-3 h-3" />
                    Pause
                  </button>
                  
                  <button
                    onClick={stopAudio}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                    title="Stop audio"
                  >
                    <FaStop className="w-3 h-3" />
                    Stop
                  </button>
                </>
              )}
            </div>
          )}

          {/* Audio Status Display */}
          {(isGeneratingAudio || audioExplanation) && (
            <div className="bg-gray-800 rounded-lg p-4 border border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-purple-400 text-xl">🎤</div>
                <h3 className="text-white font-semibold">Audio Explanation</h3>
                {isPlayingAudio && (
                  <div className="text-green-400 text-sm animate-pulse ml-auto">
                    ♪ Playing...
                  </div>
                )}
              </div>
              
              {isGeneratingAudio ? (
                <div className="text-gray-400 italic animate-pulse">
                  Generating professional audio explanation of your dashboard...
                </div>
              ) : audioExplanation ? (
                <div className="text-gray-300 text-sm leading-relaxed max-h-32 overflow-y-auto">
                  {audioExplanation.substring(0, 200)}...
                </div>
              ) : null}
            </div>
          )}
          {/*kaushik - END: Audio Controls Panel*/}
          
          {/* Chart Display Area */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-900 rounded-lg min-h-[500px] border border-gray-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {activeCharts.map(chartType => (
              <div 
                key={chartType} 
                className="bg-gray-800 rounded-lg shadow-lg p-3 relative border border-gray-700 hover:border-blue-500 transition-colors h-[300px] flex items-center justify-center"
              >
                <button 
                  onClick={() => setActiveCharts(prev => prev.filter(t => t !== chartType))}
                  className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  ×
                </button>
                {renderChart(chartType)}
              </div>
            ))}
            {activeCharts.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
                <p className="text-gray-400">Drag charts from the palette to add them here</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">No data available</p>
        </div>
      )}
    </div>
  );
}