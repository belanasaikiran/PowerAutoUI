'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DonutChartProps {
  data?: Array<{ label: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  colors?: string[];
  onTitleChange?: (newTitle: string) => void;
  onColorChange?: (colors: string[]) => void;
  editable?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data = [
    { label: 'Desktop', value: 45 },
    { label: 'Mobile', value: 35 },
    { label: 'Tablet', value: 20 },
  ],
  width = 400,
  height = 400,
  title = "Donut Chart",
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
    "#FF8A65", "#81C784", "#64B5F6", "#FFB74D", "#F06292", "#A1887F"
  ];

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 20;
    const radius = Math.min(width, height - 60) / 2 - margin;
    const innerRadius = radius * 0.6; // Creates the donut hole

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${(height - 60) / 2})`);

    const pie = d3.pie<{ label: string; value: number; color?: string }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const labelArc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add the arcs
    arcs.append('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => d.data.color || currentColors[i % currentColors.length])
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('opacity', 0.8);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).transition().duration(200).attr('opacity', 1);
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => d.data.label);

    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => {
        const centroid = arc.centroid(d as any);
        return `translate(${centroid[0] * 0.7}, ${centroid[1] * 0.7})`;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('fill', 'white')
      .text(d => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((d.data.value / total) * 100).toFixed(1);
        return `${percentage}%`;
      });

    // Add center text
    const total = data.reduce((sum, item) => sum + item.value, 0);
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Total');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '14px')
      .text(total.toLocaleString());

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
                          title={`Set color for ${data[dataIndex]?.label}`}
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

export default DonutChart; 