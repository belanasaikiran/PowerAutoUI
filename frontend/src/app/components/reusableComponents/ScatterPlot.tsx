'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ScatterPlotProps {
  data: Array<{ x: number; y: number; label?: string; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  width = 500,
  height = 400,
  title = "Scatter Plot",
  xLabel = "X Axis",
  yLabel = "Y Axis",
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

    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - 60 - margin.top - margin.bottom); // Account for title space

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([innerHeight, 0]);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "10px");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "10px");

    // Add X axis label
    g.append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 30})`)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text(xLabel);

    // Add Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text(yLabel);

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", (d, i) => d.color || currentColors[i % currentColors.length])
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6).attr("opacity", 0.8);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("r", 4).attr("opacity", 1);
      });

  }, [data, currentColors, width, height, xLabel, yLabel]);

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
                          title={`Set color for point ${dataIndex + 1}`}
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

export default ScatterPlot; 