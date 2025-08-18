import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Threat } from '../../types';

interface ThreatRadarProps {
  threats: Threat[];
}

const ThreatRadar: React.FC<ThreatRadarProps> = ({ threats }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!threats.length || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Create scales
    const timeScale = d3.scaleTime()
      .domain([new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()])
      .range([0, 2 * Math.PI]);
      
    const severityScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);
    
    // Draw radar rings
    const rings = [0.25, 0.5, 0.75, 1];
    svg.selectAll('.ring')
      .data(rings)
      .enter()
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', d => radius * d)
      .attr('fill', 'none')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 1);
    
    // Draw threat points
    svg.selectAll('.threat')
      .data(threats)
      .enter()
      .append('circle')
      .attr('class', d => `threat threat-${d.severity > 80 ? 'critical' : d.severity > 60 ? 'high' : d.severity > 40 ? 'medium' : 'low'}`)
      .attr('cx', d => {
        const angle = timeScale(new Date(d.timestamp));
        return centerX + Math.sin(angle) * severityScale(d.severity);
      })
      .attr('cy', d => {
        const angle = timeScale(new Date(d.timestamp));
        return centerY - Math.cos(angle) * severityScale(d.severity);
      })
      .attr('r', 6)
      .attr('fill', d => {
        if (d.severity > 80) return '#EF4444';
        if (d.severity > 60) return '#F59E0B';
        if (d.severity > 40) return '#3B82F6';
        return '#10B981';
      })
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .append('title')
      .text(d => `${d.type}: ${d.description}`);
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);
      
    const severityLevels = [
      { label: 'Critical', color: '#EF4444' },
      { label: 'High', color: '#F59E0B' },
      { label: 'Medium', color: '#3B82F6' },
      { label: 'Low', color: '#10B981' }
    ];
    
    legend.selectAll('rect')
      .data(severityLevels)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 25)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color)
      .attr('rx', 2);
      
    legend.selectAll('text')
      .data(severityLevels)
      .enter()
      .append('text')
      .attr('x', 25)
      .attr('y', (d, i) => i * 25 + 12)
      .attr('fill', '#4B5563')
      .attr('font-size', '12px')
      .text(d => d.label);
    
    // Add time axis labels
    const timeLabels = [
      { label: '24h ago', angle: 0 },
      { label: '18h ago', angle: Math.PI / 4 },
      { label: '12h ago', angle: Math.PI / 2 },
      { label: '6h ago', angle: 3 * Math.PI / 4 },
      { label: 'Now', angle: Math.PI }
    ];
    
    timeLabels.forEach(({ label, angle }) => {
      const x = centerX + Math.sin(angle) * (radius + 30);
      const y = centerY - Math.cos(angle) * (radius + 30);
      
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6B7280')
        .attr('font-size', '10px')
        .text(label);
    });
    
  }, [threats]);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Real-time Threat Radar</h2>
      <div className="text-sm text-gray-600 mb-4">
        Threats positioned by time (radius) and severity (distance from center)
      </div>
      <svg 
        ref={svgRef} 
        className="w-full" 
        height="400"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default ThreatRadar; 