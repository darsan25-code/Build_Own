'use client';

import React, { useState } from 'react';
import { Globe, Building, Users, Radio, Sparkles, CheckCircle2 } from 'lucide-react';

interface NodeItem {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'primary' | 'secondary' | 'tertiary';
}

// 18 Logically Placed Realistic ACM Chapter Nodes
const CHAPTER_NODES: NodeItem[] = [
  // Primary Vel Tech Chapter Node
  { id: 'veltech', name: 'Vel Tech High Tech ACM Chapter', x: 725, y: 225, type: 'primary' },
  
  // Secondary Global Hubs
  { id: 'na-east', name: 'MIT / Columbia ACM', x: 290, y: 135, type: 'secondary' },
  { id: 'na-west', name: 'Stanford / Berkeley ACM', x: 165, y: 145, type: 'secondary' },
  { id: 'eu-uk', name: 'Oxford / Imperial London ACM', x: 485, y: 105, type: 'secondary' },
  { id: 'eu-central', name: 'ETH Zurich / Munich ACM', x: 520, y: 100, type: 'secondary' },
  { id: 'india-delhi', name: 'IIT Delhi / North India ACM', x: 715, y: 175, type: 'secondary' },
  { id: 'me-dubai', name: 'UAE / Dubai Tech Hub ACM', x: 635, y: 195, type: 'secondary' },
  { id: 'se-singapore', name: 'NUS Singapore ACM', x: 795, y: 260, type: 'secondary' },
  { id: 'east-tokyo', name: 'University of Tokyo ACM', x: 885, y: 145, type: 'secondary' },
  { id: 'aus-sydney', name: 'University of Sydney ACM', x: 915, y: 360, type: 'secondary' },
  
  // Tertiary Regional Chapters
  { id: 'na-chicago', name: 'Chicago Tech ACM', x: 245, y: 130, type: 'tertiary' },
  { id: 'sa-saopaulo', name: 'Sao Paulo ACM', x: 365, y: 330, type: 'tertiary' },
  { id: 'eu-poland', name: 'Warsaw Tech ACM', x: 560, y: 95, type: 'tertiary' },
  { id: 'africa-cairo', name: 'Cairo ACM', x: 570, y: 185, type: 'tertiary' },
  { id: 'africa-capetown', name: 'Cape Town ACM', x: 550, y: 390, type: 'tertiary' },
  { id: 'india-kolkata', name: 'IIT Kharagpur ACM', x: 750, y: 195, type: 'tertiary' },
  { id: 'east-beijing', name: 'Tsinghua Beijing ACM', x: 830, y: 140, type: 'tertiary' },
  { id: 'aus-perth', name: 'Perth Tech ACM', x: 855, y: 350, type: 'tertiary' },
];

// Connection route arcs
const ROUTE_ARCS = [
  // Primary Vel Tech Connections
  { id: 'vt-dubai', from: [725, 225], to: [635, 195], curvature: 18, isPrimary: true },
  { id: 'vt-singapore', from: [725, 225], to: [795, 260], curvature: 15, isPrimary: true },
  { id: 'vt-delhi', from: [725, 225], to: [715, 175], curvature: -10, isPrimary: true },
  { id: 'vt-zurich', from: [725, 225], to: [520, 100], curvature: -35, isPrimary: true },
  
  // Transcontinental Network Routes
  { id: 'uk-mit', from: [485, 105], to: [290, 135], curvature: -35, isPrimary: false },
  { id: 'mit-stanford', from: [290, 135], to: [165, 145], curvature: -15, isPrimary: false },
  { id: 'stanford-tokyo', from: [165, 145], to: [885, 145], curvature: -45, isPrimary: false },
  { id: 'tokyo-singapore', from: [885, 145], to: [795, 260], curvature: 25, isPrimary: false },
  { id: 'singapore-sydney', from: [795, 260], to: [915, 360], curvature: -20, isPrimary: false },
  { id: 'uk-cairo', from: [485, 105], to: [570, 185], curvature: 20, isPrimary: false },
  { id: 'mit-saopaulo', from: [290, 135], to: [365, 330], curvature: 30, isPrimary: false },
  { id: 'cairo-capetown', from: [570, 185], to: [550, 390], curvature: 25, isPrimary: false },
];

function createArcPath(from: number[], to: number[], curvature: number) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2 + curvature;
  return `M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`;
}

export default function CompleteNetworkHeroVisual() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-[#07152D]/90 backdrop-blur-2xl border border-[#082B52] hover:border-[#00AEEF]/40 transition-colors duration-300 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/50 flex flex-col justify-between overflow-hidden">
      
      {/* Background Volumetric Cyan Halo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#00AEEF]/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Header Matrix Status Bar */}
      <div className="flex items-center justify-between z-20 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16C7F3] animate-pulse shadow-[0_0_10px_#00AEEF]" />
          <span className="text-[11px] sm:text-xs font-mono font-extrabold text-slate-200 tracking-wider uppercase">
            ACM STUDENT CHAPTER MATRIX
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-extrabold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE NETWORK</span>
        </div>
      </div>

      {/* Complete World Map Vector Canvas Container */}
      <div className="relative z-10 w-full aspect-[2/1] my-auto flex items-center justify-center">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full block drop-shadow-[0_0_25px_rgba(0,174,239,0.2)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="map-arc-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#16C7F3" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="map-arc-sec" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="land-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B2754" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#071938" stopOpacity="0.8" />
            </linearGradient>

            {/* Grid Pattern */}
            <pattern id="matrix-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="0.75" fill="rgba(0, 174, 239, 0.09)" />
            </pattern>

            <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Matrix Dots Background Overlay */}
          <rect x="0" y="0" width="1000" height="500" fill="url(#matrix-dots)" />

          {/* Latitude & Longitude Grid Lines */}
          <g stroke="rgba(0, 174, 239, 0.11)" strokeWidth="0.8" strokeDasharray="3 6">
            <line x1="165" y1="20" x2="165" y2="480" />
            <line x1="330" y1="20" x2="330" y2="480" />
            <line x1="505" y1="20" x2="505" y2="480" />
            <line x1="715" y1="20" x2="715" y2="480" />
            <line x1="875" y1="20" x2="875" y2="480" />
            <line x1="20" y1="135" x2="980" y2="135" />
            <line x1="20" y1="250" x2="980" y2="250" />
            <line x1="20" y1="360" x2="980" y2="360" />
          </g>

          {/* Continent Outlines (Realistic Vector Boundaries with Illuminated Cyan Borders) */}
          <g fill="url(#land-gradient)" stroke="#00AEEF" strokeWidth="1.2" strokeOpacity="0.45">
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
            {/* Australia */}
            <path d="M 840,310 Q 900,300 950,320 Q 960,370 930,410 Q 870,420 850,380 Q 830,350 840,310 Z" />
          </g>

          {/* Connection Route Arcs & Animated Light Packets */}
          {ROUTE_ARCS.map((arc) => {
            const pathD = createArcPath(arc.from, arc.to, arc.curvature);
            return (
              <g key={arc.id}>
                {/* Base Curved Path Line */}
                <path
                  d={pathD}
                  stroke={arc.isPrimary ? 'url(#map-arc-primary)' : 'url(#map-arc-sec)'}
                  strokeWidth={arc.isPrimary ? '1.8' : '1.2'}
                  strokeDasharray={arc.isPrimary ? 'none' : '4 4'}
                  fill="none"
                />
                {/* Animated Traveling Spark along route */}
                <path
                  d={pathD}
                  stroke="#FFFFFF"
                  strokeWidth="2.8"
                  strokeOpacity="0.95"
                  strokeDasharray="10 160"
                  filter="url(#glow-filter)"
                  fill="none"
                  className="animate-spark-flow"
                />
              </g>
            );
          })}

          {/* Chapter Nodes (18 Realistic Nodes with Hierarchy) */}
          {CHAPTER_NODES.map((node) => {
            const isVelTech = node.id === 'veltech';
            const isHovered = activeNode === node.id;
            
            const r = isVelTech ? 8 : node.type === 'secondary' ? 5 : 3.5;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {/* Outer Pulse Ring for Vel Tech Primary Node */}
                {isVelTech && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="none"
                      stroke="#00AEEF"
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                      className="animate-ping-veltech"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="14"
                      fill="none"
                      stroke="#16C7F3"
                      strokeWidth="1.8"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                    />
                  </>
                )}

                {/* Outer Ring for Secondary Nodes */}
                {node.type === 'secondary' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r * 2.2}
                    fill="none"
                    stroke="#00AEEF"
                    strokeWidth="1"
                    strokeOpacity={isHovered ? '0.9' : '0.4'}
                    className="animate-pulse"
                  />
                )}

                {/* Node Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={isVelTech ? '#16C7F3' : node.type === 'secondary' ? '#00AEEF' : '#38BDF8'}
                  filter="url(#glow-filter)"
                />
                <circle cx={node.x} cy={node.y} r={r * 0.45} fill="#FFFFFF" />

                {/* Integrated Leader Line & Callout Badge for VEL TECH HIGH TECH (Primary Node) */}
                {isVelTech && (
                  <g transform={`translate(${node.x}, ${node.y})`}>
                    {/* Leader Line */}
                    <path
                      d="M 0 0 L 0 32 L -40 32"
                      stroke="#00AEEF"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      fill="none"
                    />
                    {/* Integrated Glass Callout Badge */}
                    <foreignObject x="-185" y="16" width="140" height="42">
                      <div className="bg-[#050B1A]/95 backdrop-blur-md border border-[#00AEEF]/60 rounded-lg p-1.5 shadow-xl shadow-cyan-950/80 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                        <div>
                          <div className="text-[9px] font-mono font-extrabold text-[#16C7F3] leading-tight tracking-wider">
                            VEL TECH HIGH TECH
                          </div>
                          <div className="text-[7.5px] font-mono font-bold text-slate-300 tracking-widest uppercase">
                            ACTIVE CHAPTER
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )}

                {/* Hover Tooltip for Other Nodes */}
                {isHovered && !isVelTech && (
                  <g transform={`translate(${node.x}, ${node.y - 25})`}>
                    <rect
                      x="-70"
                      y="-18"
                      width="140"
                      height="24"
                      rx="6"
                      fill="#050B1A"
                      stroke="#00AEEF"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Integrated Compact Glass Metric Panels inside Map Canvas */}

          {/* Card 1: 1,000+ Student Chapters (Pinned Top-Left) */}
          <foreignObject x="30" y="30" width="165" height="48">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-xl p-2 shadow-lg shadow-cyan-950/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00AEEF]/15 text-[#16C7F3] border border-[#00AEEF]/30 flex items-center justify-center flex-shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-extrabold text-white tracking-tight leading-none">1,000+</div>
                <div className="text-[8.5px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">
                  STUDENT CHAPTERS
                </div>
              </div>
            </div>
          </foreignObject>

          {/* Card 2: 100+ Countries (Pinned Top-Right) */}
          <foreignObject x="410" y="25" width="145" height="48">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-xl p-2 shadow-lg shadow-cyan-950/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00AEEF]/15 text-[#16C7F3] border border-[#00AEEF]/30 flex items-center justify-center flex-shrink-0">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-extrabold text-white tracking-tight leading-none">100+</div>
                <div className="text-[8.5px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">
                  COUNTRIES
                </div>
              </div>
            </div>
          </foreignObject>

          {/* Card 3: 50K+ Student Members (Pinned Bottom-Right) */}
          <foreignObject x="800" y="420" width="165" height="48">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-xl p-2 shadow-lg shadow-cyan-950/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-extrabold text-white tracking-tight leading-none">50,000+</div>
                <div className="text-[8.5px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">
                  STUDENT MEMBERS
                </div>
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Footer Matrix Status Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-[#082B52] z-20 relative text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>VEL TECH HIGH TECH ACM CHAPTER HUB</span>
        </div>
        <span className="hidden sm:inline">GLOBAL LATENCY: 12MS</span>
      </div>

      <style jsx global>{`
        @keyframes sparkFlow {
          0% {
            stroke-dashoffset: 170;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-spark-flow {
          animation: sparkFlow 3.8s linear infinite;
        }
        @keyframes pingVelTech {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .animate-ping-veltech {
          transform-origin: center;
          animation: pingVelTech 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
