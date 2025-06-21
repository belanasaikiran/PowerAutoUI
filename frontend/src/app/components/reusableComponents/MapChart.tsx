'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface MapChartProps {
  data: Array<{ region: string; value: number; coordinates?: [number, number] }>;
  width?: number;
  height?: number;
  title?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const MapChart: React.FC<MapChartProps> = ({
  data,
  width = 500,
  height = 400,
  title = "Geographic Map",
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

  // Sample geographic data (simplified world regions)
  const geoData = [
    { region: "North America", coordinates: [250, 150], value: 0 },
    { region: "South America", coordinates: [220, 280], value: 0 },
    { region: "Europe", coordinates: [300, 120], value: 0 },
    { region: "Africa", coordinates: [320, 200], value: 0 },
    { region: "Asia", coordinates: [380, 140], value: 0 },
    { region: "Australia", coordinates: [420, 300], value: 0 }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - 60 - margin.top - margin.bottom);

    // Scale coordinates to fit the available space
    const scaleX = innerWidth / 500; // Original width was 500
    const scaleY = innerHeight / 400; // Original height was 400
    const scale = Math.min(scaleX, scaleY);

    // Merge provided data with geographic coordinates
    const mergedData = geoData.map(geo => {
      const dataPoint = data.find(d => d.region === geo.region);
      return {
        ...geo,
        value: dataPoint ? dataPoint.value : 0,
        coordinates: [
          (dataPoint?.coordinates?.[0] || geo.coordinates[0]) * scale,
          (dataPoint?.coordinates?.[1] || geo.coordinates[1]) * scale
        ] as [number, number]
      };
    });

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw simplified world map outline
    const worldOutline = [
      [50 * scale, 80 * scale], 
      [450 * scale, 80 * scale], 
      [450 * scale, 320 * scale], 
      [50 * scale, 320 * scale], 
      [50 * scale, 80 * scale]
    ];

    g.append("path")
      .datum(worldOutline)
      .attr("d", d3.line() as any)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // Draw continents as simplified shapes (scaled)
    const continents = [
      { name: "North America", path: [[180, 100], [280, 100], [320, 180], [200, 200], [180, 100]].map(([x, y]) => [x * scale, y * scale]) },
      { name: "South America", path: [[200, 220], [240, 220], [250, 320], [190, 330], [200, 220]].map(([x, y]) => [x * scale, y * scale]) },
      { name: "Europe", path: [[280, 90], [340, 90], [350, 140], [270, 150], [280, 90]].map(([x, y]) => [x * scale, y * scale]) },
      { name: "Africa", path: [[290, 160], [350, 160], [360, 280], [280, 290], [290, 160]].map(([x, y]) => [x * scale, y * scale]) },
      { name: "Asia", path: [[350, 90], [430, 90], [440, 200], [340, 180], [350, 90]].map(([x, y]) => [x * scale, y * scale]) },
      { name: "Australia", path: [[390, 280], [450, 280], [460, 320], [380, 330], [390, 280]].map(([x, y]) => [x * scale, y * scale]) }
    ];

    const maxValue = d3.max(mergedData, d => d.value) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue]);

    continents.forEach((continent, i) => {
      const regionData = mergedData.find(d => d.region === continent.name);
      const fillColor = regionData && regionData.value > 0 
        ? colorScale(regionData.value)
        : "#f0f0f0";

      g.append("path")
        .datum(continent.path)
        .attr("d", d3.line() as any)
        .attr("fill", fillColor)
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("opacity", 1);
        });
    });

    // Add data points as circles
    g.selectAll(".data-point")
      .data(mergedData.filter(d => d.value > 0))
      .enter().append("circle")
      .attr("class", "data-point")
      .attr("cx", d => d.coordinates[0])
      .attr("cy", d => d.coordinates[1])
      .attr("r", d => Math.sqrt(d.value) * 2 + 3) // Smaller circles for better fit
      .attr("fill", (d, i) => currentColors[i % currentColors.length])
      .attr("fill-opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill-opacity", 1);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill-opacity", 0.7);
      });

    // Add labels
    g.selectAll(".label")
      .data(mergedData.filter(d => d.value > 0))
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => d.coordinates[0])
      .attr("y", d => d.coordinates[1] - Math.sqrt(d.value) * 2 - 8)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => `${d.region}: ${d.value}`);

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
                          title={`Set color for ${data[dataIndex]?.region}`}
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

export default MapChart; 