'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface GaugeChartProps {
  value?: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  title?: string;
  unit?: string;
  onTitleChange?: (newTitle: string) => void;
  editable?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 75,
  min = 0,
  max = 100,
  width = 400,
  height = 300,
  title = "Performance Gauge",
  unit = "%",
  onTitleChange,
  editable = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 20;
    const radius = Math.min(width, height - 60) / 2 - margin;
    const centerX = width / 2;
    const centerY = (height - 60) / 2 + 20;

    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .cornerRadius(5);

    // Background arc
    g.append("path")
      .datum({ endAngle: Math.PI / 2 })
      .style("fill", "#e0e7ff")
      .attr("d", arc as any);

    // Value arc
    const valueAngle = -Math.PI / 2 + (Math.PI * (value - min) / (max - min));
    g.append("path")
      .datum({ endAngle: valueAngle })
      .style("fill", value > 80 ? "#10b981" : value > 60 ? "#f59e0b" : value > 40 ? "#ef4444" : "#6b7280")
      .attr("d", arc as any)
      .transition()
      .duration(1000)
      .attrTween("d", function(d: any) {
        const interpolate = d3.interpolate({ endAngle: -Math.PI / 2 }, d);
        return function(t) {
          return (arc as any)(interpolate(t));
        };
      });

    // Needle
    const needleAngle = -Math.PI / 2 + (Math.PI * (value - min) / (max - min));
    const needleLength = radius * 0.8;
    
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", needleLength * Math.cos(needleAngle))
      .attr("y2", needleLength * Math.sin(needleAngle))
      .attr("stroke", "#374151")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // Center circle
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("fill", "#374151");

    // Value text
    g.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#374151")
      .text(`${value}${unit}`);

    // Min/Max labels
    g.append("text")
      .attr("x", -radius * 0.9)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text(`${min}${unit}`);

    g.append("text")
      .attr("x", radius * 0.9)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text(`${max}${unit}`);

    // Tick marks
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const angle = -Math.PI / 2 + (Math.PI * i / ticks);
      const innerRadius = radius * 0.85;
      const outerRadius = radius * 0.95;
      
      g.append("line")
        .attr("x1", innerRadius * Math.cos(angle))
        .attr("y1", innerRadius * Math.sin(angle))
        .attr("x2", outerRadius * Math.cos(angle))
        .attr("y2", outerRadius * Math.sin(angle))
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 2);
    }

  }, [value, min, max, width, height]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    onTitleChange?.(currentTitle);
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

export default GaugeChart; 