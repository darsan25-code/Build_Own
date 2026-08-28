'use client';

import React, { useState, useEffect, useRef } from 'react';

// Geographic node locations (x, y coordinates mapped onto a 1000x500 viewBox world map)
interface RegionNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  isMajor: boolean;
  metricBadge?: {
    title: string;
    subtitle: string;
    offsetX: number;
    offsetY: number;
  };
}

const REGION_NODES: RegionNode[] = [
  {
    id: 'na-west',
    label: 'North America West',
    sublabel: 'USA / Canada',
    x: 165,
    y: 145,
    isMajor: false,
  },
  {
    id: 'na-east',
    label: 'North America East',
    sublabel: 'USA / Canada',
    x: 290,
    y: 135,
    isMajor: true,
    metricBadge: {
      title: '1,000+',
      subtitle: 'ACTIVE CHAPTERS',
      offsetX: -120,
      offsetY: -45,
    },
  },
  {
    id: 'sa',
    label: 'South America',
    sublabel: 'Brazil / Argentina',
    x: 365,
    y: 325,
    isMajor: false,
  },
  {
    id: 'eu-west',
    label: 'Europe Hub',
    sublabel: 'UK & Central Europe',
    x: 505,
    y: 105,
    isMajor: true,
    metricBadge: {
      title: '100+',
      subtitle: 'COUNTRIES',
      offsetX: 20,
      offsetY: -50,
    },
  },
  {
    id: 'africa',
    label: 'Africa Hub',
    sublabel: 'North & South Africa',
    x: 555,
    y: 250,
    isMajor: false,
  },
  {
    id: 'india',
    label: 'South Asia (India)',
    sublabel: 'India Chapter Hub',
    x: 715,
    y: 175,
    isMajor: true,
    metricBadge: {
      title: '50K+',
      subtitle: 'STUDENT MEMBERS',
      offsetX: -40,
      offsetY: 45,
    },
  },
  {
    id: 'east-asia',
    label: 'East Asia',
    sublabel: 'Japan / Korea / China',
    x: 875,
    y: 145,
    isMajor: true,
  },
  {
    id: 'se-asia',
    label: 'Southeast Asia',
    sublabel: 'Singapore / Malaysia',
    x: 795,
    y: 255,
    isMajor: false,
  },
  {
    id: 'aus',
    label: 'Australia & Oceania',
    sublabel: 'Sydney / Melbourne',
    x: 915,
    y: 355,
    isMajor: true,
    metricBadge: {
      title: 'ACM GLOBAL',
      subtitle: 'NETWORK HUB',
      offsetX: -120,
      offsetY: 35,
    },
  },
];

// Meaningful Curved Route Arcs connecting the major global hubs
const ROUTE_ARCS = [
  { id: 'na-west-east', from: [165, 145], to: [290, 135], curvature: -20 },
  { id: 'na-east-eu', from: [290, 135], to: [505, 105], curvature: -40 },
  { id: 'eu-africa', from: [505, 105], to: [555, 250], curvature: 25 },
  { id: 'eu-india', from: [505, 105], to: [715, 175], curvature: -35 },
  { id: 'india-seasia', from: [715, 175], to: [795, 255], curvature: 20 },
  { id: 'seasia-aus', from: [795, 255], to: [915, 355], curvature: -25 },
  { id: 'india-eastasia', from: [715, 175], to: [875, 145], curvature: -30 },
  { id: 'na-east-sa', from: [290, 135], to: [365, 325], curvature: 35 },
  { id: 'eastasia-nawest', from: [875, 145], to: [990, 140], curvature: -25 }, // Loop around Pacific
];

// Helper to compute SVG Quadratic Bezier path string
function createArcPath(from: number[], to: number[], curvature: number) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2 + curvature;
  return `M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`;
}

export default function GlobalNetworkMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotatePos, setRotatePos] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Subtle Mouse Parallax Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalized offset between -1 and 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setRotatePos({
      x: normY * -4, // tilt X up/down (deg)
      y: normX * 6,  // tilt Y left/right (deg)
    });
  };

  const handleMouseLeave = () => {
    setRotatePos({ x: 0, y: 0 });
    setActiveNode(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[560px] mx-auto aspect-[2/1] sm:aspect-[2/1] flex items-center justify-center select-none group perspective-1000 py-2"
      style={{
        transform: `perspective(1000px) rotateX(${rotatePos.x}deg) rotateY(${rotatePos.y}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
    >
      {/* 1. Soft Ambient Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/10 via-[#07152D]/50 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* 2. World Map SVG Surface */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full relative z-10 overflow-visible drop-shadow-[0_0_25px_rgba(0,174,239,0.15)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Pattern for World Map Surface */}
          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 174, 239, 0.05)" strokeWidth="0.8" />
          </pattern>

          {/* Linear Gradients for Route Arcs */}
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#16C7F3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Latitude & Longitude Digital Grid Lines */}
        <g stroke="rgba(0, 174, 239, 0.12)" strokeWidth="0.8" strokeDasharray="3 6">
          {/* Longitude meridians */}
          <line x1="165" y1="20" x2="165" y2="480" />
          <line x1="330" y1="20" x2="330" y2="480" />
          <line x1="500" y1="20" x2="500" y2="480" />
          <line x1="665" y1="20" x2="665" y2="480" />
          <line x1="835" y1="20" x2="835" y2="480" />
          {/* Latitude parallels */}
          <line x1="20" y1="120" x2="980" y2="120" />
          <line x1="20" y1="250" x2="980" y2="250" />
          <line x1="20" y1="380" x2="980" y2="380" />
        </g>

        {/* Geographic World Map Continent Outlines (Recognizable vector outlines) */}
        <g fill="#071938" fillOpacity="0.75" stroke="#00AEEF" strokeWidth="1.2" strokeOpacity="0.35" className="transition-all duration-300">
          {/* North America */}
          <path d="M 80,70 Q 140,55 220,50 Q 300,50 380,35 Q 420,30 430,70 Q 370,100 340,110 Q 320,130 310,160 Q 300,200 290,210 Q 260,250 230,270 Q 210,250 200,210 Q 180,180 150,160 Q 110,140 80,70 Z" />
          
          {/* South America */}
          <path d="M 290,270 Q 340,260 380,280 Q 420,310 430,340 Q 400,400 370,450 Q 340,460 330,420 Q 320,360 310,320 Q 300,290 290,270 Z" />
          
          {/* Europe */}
          <path d="M 450,170 Q 470,120 480,95 Q 520,60 560,55 Q 590,80 600,110 Q 580,140 550,155 Q 510,175 450,170 Z" />
          
          {/* Africa */}
          <path d="M 450,180 Q 520,175 580,180 Q 640,240 620,290 Q 580,360 550,420 Q 510,380 470,300 Q 450,260 450,180 Z" />
          
          {/* Asia & India */}
          <path d="M 600,100 Q 680,60 800,50 Q 900,60 930,110 Q 910,160 860,180 Q 820,230 790,270 Q 750,250 715,220 Q 670,210 650,170 Q 610,140 600,100 Z" />
          
          {/* Australia & Oceania */}
          <path d="M 840,310 Q 900,300 950,320 Q 960,370 930,410 Q 870,420 850,380 Q 830,350 840,310 Z" />
        </g>

        {/* Digital Tech Grid Overlay on Continents */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#grid-pattern)" className="pointer-events-none" />

        {/* Curved Connection Route Arcs */}
        <g stroke="url(#arc-gradient)" fill="none">
          {ROUTE_ARCS.map((arc) => {
            const pathD = createArcPath(arc.from, arc.to, arc.curvature);
            return (
              <g key={arc.id}>
                {/* Base Faint Route Arc */}
                <path
                  d={pathD}
                  strokeWidth="1.4"
                  strokeOpacity="0.45"
                  strokeDasharray="4 4"
                />
                {/* Animated Traveling Data Packet Spark along path */}
                <path
                  d={pathD}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeOpacity="0.9"
                  strokeDasharray="8 160"
                  filter="url(#glow-cyan)"
                  className="animate-dash-travel"
                />
              </g>
            );
          })}
        </g>

        {/* Meaningful Geographic Region Nodes */}
        {REGION_NODES.map((node) => {
          const isHovered = activeNode === node.id;
          const nodeRadius = node.isMajor ? 6 : 4;

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setActiveNode(node.id)}
            >
              {/* Outer Pulse Ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius * 2.4}
                fill="none"
                stroke="#00AEEF"
                strokeWidth="1.2"
                strokeOpacity={isHovered ? '0.8' : '0.35'}
                className={node.isMajor ? 'animate-ping-slow' : ''}
              />

              {/* Glowing Node Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={node.isMajor ? '#16C7F3' : '#00AEEF'}
                filter="url(#glow-cyan)"
              />

              {/* Node Center White Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius * 0.45}
                fill="#FFFFFF"
              />

              {/* Meaningful Data Metric Badge linked to Node */}
              {node.metricBadge && (
                <g
                  transform={`translate(${node.x + node.metricBadge.offsetX}, ${node.y + node.metricBadge.offsetY})`}
                  className="transition-all duration-300 pointer-events-none"
                >
                  {/* Visual Leader Line from Node to Badge */}
                  <line
                    x1={-node.metricBadge.offsetX}
                    y1={-node.metricBadge.offsetY}
                    x2="10"
                    y2="15"
                    stroke="#00AEEF"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    strokeDasharray="2 2"
                  />

                  {/* Badge Container */}
                  <foreignObject width="145" height="46" x="0" y="0">
                    <div className="bg-[#07152D]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-xl px-2.5 py-1 shadow-lg shadow-cyan-950/50 flex flex-col justify-center">
                      <span className="text-[11px] font-mono font-extrabold text-[#16C7F3] leading-none tracking-tight">
                        {node.metricBadge.title}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">
                        {node.metricBadge.subtitle}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tailwind Keyframe Injection for Traveling Data Spark */}
      <style jsx global>{`
        @keyframes dashTravel {
          0% {
            stroke-dashoffset: 168;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash-travel {
          animation: dashTravel 3.5s linear infinite;
        }
        @keyframes pingSlow {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        .animate-ping-slow {
          transform-origin: center;
          animation: pingSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
