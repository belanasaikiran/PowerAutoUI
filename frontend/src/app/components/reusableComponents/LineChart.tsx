'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data?: Array<{ x: number | string; y: number; series?: string }>;
  width?: number;
  height?: number;
  title?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data = [
    { x: 'Jan', y: 65, series: 'Sales' },
    { x: 'Feb', y: 80, series: 'Sales' },
    { x: 'Mar', y: 75, series: 'Sales' },
    { x: 'Apr', y: 90, series: 'Sales' },
    { x: 'May', y: 85, series: 'Sales' },
    { x: 'Jun', y: 95, series: 'Sales' },
  ],
  width = 500,
  height = 400,
  title = "Line Chart",
  colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"],
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
    "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#00BCD4",
    "#8BC34A", "#FF5722", "#3F51B5", "#FFC107", "#E91E63", "#009688"
  ];

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - 60 - margin.top - margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Group data by series
    const seriesData = d3.group(data, d => d.series || 'default');
    const series = Array.from(seriesData.keys());

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d.x)))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) || 100])
      .range([innerHeight, 0]);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "10px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "10px");

    // Create line generator
    const line = d3.line<{ x: string | number; y: number }>()
      .x(d => (xScale(String(d.x)) || 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Draw lines for each series
    series.forEach((seriesName, seriesIndex) => {
      const seriesPoints = seriesData.get(seriesName) || [];
      const color = currentColors[seriesIndex % currentColors.length];

      // Draw line
      g.append("path")
        .datum(seriesPoints)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line as any);

      // Draw points
      g.selectAll(`.point-${seriesIndex}`)
        .data(seriesPoints)
        .enter().append("circle")
        .attr("class", `point-${seriesIndex}`)
        .attr("cx", d => (xScale(String(d.x)) || 0) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.y))
        .attr("r", 4)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
          d3.select(this).attr("r", 6);
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("r", 4);
        });
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
                    <button
                      key={colorIndex}
                      onClick={() => handleColorSelect(color, 0)}
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                    />
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

export default LineChart; 