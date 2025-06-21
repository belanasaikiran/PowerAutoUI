'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface FunnelChartProps {
  data: Array<{ stage: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  width = 500,
  height = 400,
  title = "Funnel Chart",
  colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
  onTitleChange,
  onColorChange,
  editable = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentColors, setCurrentColors] = useState(colors);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);

  const colorPalette = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
    "#FF8A65", "#81C784", "#64B5F6", "#FFB74D", "#F06292", "#A1887F",
    "#90A4AE", "#FFF176", "#FF7043", "#42A5F5", "#AB47BC", "#26A69A"
  ];

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - 60 - margin.top - margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxValue = d3.max(data, d => d.value) || 1;
    const stageHeight = innerHeight / data.length;

    data.forEach((d, i) => {
      const stageWidth = (d.value / maxValue) * innerWidth;
      const y = i * stageHeight;
      const x = (innerWidth - stageWidth) / 2;

      // Create trapezoid shape for funnel effect
      const topWidth = i === 0 ? stageWidth : (data[i - 1].value / maxValue) * innerWidth;
      const bottomWidth = stageWidth;
      const topX = (innerWidth - topWidth) / 2;
      const bottomX = (innerWidth - bottomWidth) / 2;

      const pathData = [
        [topX, y],
        [topX + topWidth, y],
        [bottomX + bottomWidth, y + stageHeight - 2],
        [bottomX, y + stageHeight - 2],
        [topX, y]
      ];

      g.append("path")
        .datum(pathData)
        .attr("d", d3.line() as any)
        .attr("fill", d.color || currentColors[i % currentColors.length])
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, pathData) {
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mouseout", function(event, pathData) {
          d3.select(this).attr("opacity", 1);
        });

      // Add stage labels
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", y + stageHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(`${d.stage}: ${d.value}`);

      // Add percentage labels
      const percentage = ((d.value / maxValue) * 100).toFixed(1);
      g.append("text")
        .attr("x", innerWidth + 10)
        .attr("y", y + stageHeight / 2)
        .attr("text-anchor", "start")
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .style("fill", "#666")
        .text(`${percentage}%`);
    });

  }, [data, currentColors, width, height]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    onTitleChange?.(currentTitle);
  };

  const handleColorSelect = (color: string, index: number) => {
    const newColors = [...currentColors];
    newColors[index] = color;
    setCurrentColors(newColors);
    onColorChange?.(newColors);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        {isEditingTitle ? (
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="text-sm font-bold border border-gray-300 rounded px-2 py-1 flex-1 mr-2"
            autoFocus
          />
        ) : (
          <h3 
            className={`text-sm font-bold ${editable ? 'cursor-pointer hover:text-blue-600' : ''} flex-1`}
            onClick={() => editable && setIsEditingTitle(true)}
          >
            {currentTitle}
          </h3>
        )}
        
        {editable && (
          <div className="relative">
            <button
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            >
              Colors
            </button>
            
            {showColorPalette && (
              <div className="absolute right-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-10" style={{ minWidth: '200px' }}>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {colorPalette.map((color, colorIndex) => (
                    <div key={colorIndex} className="space-y-1">
                      {data.map((_, dataIndex) => (
                        <button
                          key={dataIndex}
                          onClick={() => handleColorSelect(color, dataIndex)}
                          className="w-4 h-4 rounded border-2 border-gray-300 hover:border-gray-500"
                          style={{ backgroundColor: color }}
                          title={`Set color for ${data[dataIndex]?.stage}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowColorPalette(false)}
                  className="w-full px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height - 60}
          className="w-full h-full"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    </div>
  );
};

export default FunnelChart; 