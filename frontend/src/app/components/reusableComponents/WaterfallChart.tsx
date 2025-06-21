'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WaterfallChartProps {
  data: Array<{ category: string; value: number; type: 'positive' | 'negative' | 'total'; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  width = 600,
  height = 400,
  title = "Waterfall Chart",
  colors = ["#4CAF50", "#F44336", "#2196F3"], // green, red, blue
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
    "#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9C27B0", "#00BCD4",
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

    // Calculate cumulative values for waterfall effect
    let cumulative = 0;
    const processedData = data.map((d, i) => {
      const startValue = cumulative;
      if (d.type !== 'total') {
        cumulative += d.value;
      } else {
        cumulative = d.value;
      }
      return {
        ...d,
        startValue,
        endValue: cumulative,
        displayValue: d.type === 'total' ? d.value : Math.abs(d.value)
      };
    });

    const xScale = d3.scaleBand()
      .domain(processedData.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.2);

    const maxValue = d3.max([
      ...processedData.map(d => Math.max(d.startValue, d.endValue)),
      0
    ]) || 1;
    const minValue = d3.min([
      ...processedData.map(d => Math.min(d.startValue, d.endValue)),
      0
    ]) || 0;

    const yScale = d3.scaleLinear()
      .domain([minValue * 1.1, maxValue * 1.1])
      .range([innerHeight, 0]);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "10px")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "10px");

    // Add zero line
    if (minValue < 0) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#666")
        .attr("stroke-dasharray", "3,3");
    }

    // Add bars
    processedData.forEach((d, i) => {
      const barColor = d.color || 
        (d.type === 'positive' ? currentColors[0] : 
         d.type === 'negative' ? currentColors[1] : currentColors[2]);

      const barHeight = Math.abs(yScale(d.startValue) - yScale(d.endValue));
      const barY = d.type === 'total' ? yScale(d.endValue) : yScale(Math.max(d.startValue, d.endValue));

      g.append("rect")
        .attr("x", xScale(d.category) || 0)
        .attr("y", barY)
        .attr("width", xScale.bandwidth())
        .attr("height", barHeight)
        .attr("fill", barColor)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function() {
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 1);
        });

      // Add connecting lines (except for total bars and first bar)
      if (i > 0 && d.type !== 'total') {
        const prevData = processedData[i - 1];
        const prevX = (xScale(prevData.category) || 0) + xScale.bandwidth();
        const currentX = xScale(d.category) || 0;
        
        g.append("line")
          .attr("x1", prevX)
          .attr("x2", currentX)
          .attr("y1", yScale(d.startValue))
          .attr("y2", yScale(d.startValue))
          .attr("stroke", "#666")
          .attr("stroke-dasharray", "2,2")
          .attr("opacity", 0.7);
      }

      // Add value labels
      g.append("text")
        .attr("x", (xScale(d.category) || 0) + xScale.bandwidth() / 2)
        .attr("y", barY - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(d.displayValue);
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
                          title={`Set color for ${data[dataIndex]?.category}`}
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

export default WaterfallChart; 