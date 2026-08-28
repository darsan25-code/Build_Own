'use client';

import React, { useState } from 'react';
import { Globe, Building, Users, Sparkles, Radio } from 'lucide-react';

// Chapter Nodes on 1000x500 map projection
const NODES = [
  { id: 'veltech', name: 'Vel Tech High Tech ACM Chapter', x: 725, y: 225, type: 'primary' },
  { id: 'na-east', name: 'MIT / Columbia ACM', x: 290, y: 135, type: 'secondary' },
  { id: 'na-west', name: 'Stanford / Berkeley ACM', x: 165, y: 145, type: 'secondary' },
  { id: 'eu-uk', name: 'Imperial London ACM', x: 485, y: 105, type: 'secondary' },
  { id: 'eu-central', name: 'ETH Zurich ACM', x: 520, y: 100, type: 'secondary' },
  { id: 'me-dubai', name: 'Dubai Tech Hub ACM', x: 635, y: 195, type: 'secondary' },
  { id: 'india-delhi', name: 'IIT Delhi ACM', x: 715, y: 175, type: 'secondary' },
  { id: 'se-singapore', name: 'NUS Singapore ACM', x: 795, y: 260, type: 'secondary' },
  { id: 'east-tokyo', name: 'Tokyo Univ ACM', x: 885, y: 145, type: 'secondary' },
  { id: 'aus-sydney', name: 'Sydney Univ ACM', x: 915, y: 360, type: 'secondary' },
  { id: 'sa-saopaulo', name: 'Sao Paulo ACM', x: 365, y: 330, type: 'tertiary' },
  { id: 'africa-cairo', name: 'Cairo Tech ACM', x: 570, y: 185, type: 'tertiary' },
  { id: 'africa-capetown', name: 'Cape Town ACM', x: 550, y: 390, type: 'tertiary' },
];

// Curved Connection Arcs
const ARCS = [
  { id: 'vt-dubai', from: [725, 225], to: [635, 195], curvature: 15, isPrimary: true },
  { id: 'vt-singapore', from: [725, 225], to: [795, 260], curvature: 12, isPrimary: true },
  { id: 'vt-delhi', from: [725, 225], to: [715, 175], curvature: -10, isPrimary: true },
  { id: 'vt-zurich', from: [725, 225], to: [520, 100], curvature: -30, isPrimary: true },
  { id: 'uk-mit', from: [485, 105], to: [290, 135], curvature: -30, isPrimary: false },
  { id: 'mit-stanford', from: [290, 135], to: [165, 145], curvature: -15, isPrimary: false },
  { id: 'tokyo-singapore', from: [885, 145], to: [795, 260], curvature: 20, isPrimary: false },
  { id: 'singapore-sydney', from: [795, 260], to: [915, 360], curvature: -18, isPrimary: false },
];

function createPath(from: number[], to: number[], curvature: number) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2 + curvature;
  return `M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`;
}

export default function HomeChapterNetworkVisual() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[500px] aspect-[1.4/1] mx-auto flex flex-col justify-between select-none overflow-hidden rounded-2xl border border-[#082B52] bg-[#050B1A]/90 backdrop-blur-md p-3 sm:p-4 shadow-xl group">
      
      {/* Background Volumetric Cyan Halo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-[#00AEEF]/14 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Live Network Status Bar */}
      <div className="flex items-center justify-between z-20 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16C7F3] animate-pulse shadow-[0_0_8px_#00AEEF]" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 tracking-wider uppercase">
            ACM CHAPTER NETWORK
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9.5px] font-mono font-extrabold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE NETWORK</span>
        </div>
      </div>

      {/* Main SVG World Map & Network Visual */}
      <div className="relative z-10 w-full aspect-[2/1] my-auto flex items-center justify-center">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full block drop-shadow-[0_0_20px_rgba(0,174,239,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="home-arc-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#16C7F3" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="home-arc-sec" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.2" />
            </linearGradient>

            <pattern id="home-matrix-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="0.75" fill="rgba(0, 174, 239, 0.08)" />
            </pattern>

            <filter id="home-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Matrix Pattern Overlay */}
          <rect x="0" y="0" width="1000" height="500" fill="url(#home-matrix-dots)" />

          {/* Longitude & Latitude Grid Lines */}
          <g stroke="rgba(0, 174, 239, 0.12)" strokeWidth="0.8" strokeDasharray="3 6">
            <line x1="165" y1="20" x2="165" y2="480" />
            <line x1="330" y1="20" x2="330" y2="480" />
            <line x1="505" y1="20" x2="505" y2="480" />
            <line x1="715" y1="20" x2="715" y2="480" />
            <line x1="875" y1="20" x2="875" y2="480" />
            <line x1="20" y1="135" x2="980" y2="135" />
            <line x1="20" y1="250" x2="980" y2="250" />
            <line x1="20" y1="360" x2="980" y2="360" />
          </g>

          {/* Continent Vector Outlines */}
          <g fill="#0A244D" fillOpacity="0.8" stroke="#00AEEF" strokeWidth="1.2" strokeOpacity="0.4">
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

          {/* Connection Arcs & Animated Traveling Sparks */}
          {ARCS.map((arc) => {
            const pathD = createPath(arc.from, arc.to, arc.curvature);
            return (
              <g key={arc.id}>
                <path
                  d={pathD}
                  stroke={arc.isPrimary ? 'url(#home-arc-primary)' : 'url(#home-arc-sec)'}
                  strokeWidth={arc.isPrimary ? '1.8' : '1.2'}
                  strokeDasharray={arc.isPrimary ? 'none' : '4 4'}
                  fill="none"
                />
                <path
                  d={pathD}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeOpacity="0.9"
                  strokeDasharray="8 150"
                  filter="url(#home-glow)"
                  fill="none"
                  className="animate-spark-travel"
                />
              </g>
            );
          })}

          {/* Chapter Nodes */}
          {NODES.map((node) => {
            const isVelTech = node.id === 'veltech';
            const isHovered = activeNode === node.id;
            const r = isVelTech ? 7.5 : node.type === 'secondary' ? 5 : 3.5;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {/* Vel Tech Outer Pulse Ring */}
                {isVelTech && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill="none"
                      stroke="#00AEEF"
                      strokeWidth="1.5"
                      strokeOpacity="0.35"
                      className="animate-pulse-ring-home"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="13"
                      fill="none"
                      stroke="#16C7F3"
                      strokeWidth="1.6"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                    />
                  </>
                )}

                {/* Secondary Node Outer Ring */}
                {node.type === 'secondary' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r * 2}
                    fill="none"
                    stroke="#00AEEF"
                    strokeWidth="1"
                    strokeOpacity={isHovered ? '0.9' : '0.35'}
                    className="animate-pulse"
                  />
                )}

                {/* Node Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={isVelTech ? '#16C7F3' : node.type === 'secondary' ? '#00AEEF' : '#38BDF8'}
                  filter="url(#home-glow)"
                />
                <circle cx={node.x} cy={node.y} r={r * 0.4} fill="#FFFFFF" />

                {/* Vel Tech Active Hub Callout Badge */}
                {isVelTech && (
                  <g transform={`translate(${node.x}, ${node.y})`}>
                    <path d="M 0 0 L 0 28 L -30 28" stroke="#00AEEF" strokeWidth="1" strokeDasharray="2 2" fill="none" />
                    <foreignObject x="-175" y="14" width="140" height="38">
                      <div className="bg-[#050B1A]/95 backdrop-blur-md border border-[#00AEEF]/60 rounded-md p-1 shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300 flex-shrink-0" />
                        <div>
                          <div className="text-[8.5px] font-mono font-extrabold text-[#16C7F3] leading-none tracking-wider">
                            VEL TECH HIGH TECH
                          </div>
                          <div className="text-[7px] font-mono font-bold text-slate-300 tracking-widest uppercase mt-0.5">
                            ACM STUDENT CHAPTER
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )}

                {/* Hover Tooltip */}
                {isHovered && !isVelTech && (
                  <g transform={`translate(${node.x}, ${node.y - 22})`}>
                    <rect x="-65" y="-16" width="130" height="22" rx="5" fill="#050B1A" stroke="#00AEEF" strokeWidth="1" />
                    <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {node.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 3 Micro Data Callouts Pinned Inside SVG Canvas */}
          <foreignObject x="30" y="30" width="140" height="38">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-lg p-1 shadow-md flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#00AEEF]/15 text-[#16C7F3] flex items-center justify-center flex-shrink-0">
                <Globe className="w-3 h-3" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-extrabold text-white leading-none">1,000+</div>
                <div className="text-[7px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">CHAPTERS</div>
              </div>
            </div>
          </foreignObject>

          <foreignObject x="430" y="25" width="130" height="38">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-lg p-1 shadow-md flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#00AEEF]/15 text-[#16C7F3] flex items-center justify-center flex-shrink-0">
                <Building className="w-3 h-3" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-extrabold text-white leading-none">100+</div>
                <div className="text-[7px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">COUNTRIES</div>
              </div>
            </div>
          </foreignObject>

          <foreignObject x="805" y="425" width="145" height="38">
            <div className="bg-[#050B1A]/90 backdrop-blur-md border border-[#00AEEF]/40 rounded-lg p-1 shadow-md flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-indigo-500/15 text-indigo-300 flex items-center justify-center flex-shrink-0">
                <Users className="w-3 h-3" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-extrabold text-white leading-none">50,000+</div>
                <div className="text-[7px] font-mono font-bold text-slate-300 tracking-wider uppercase mt-0.5">MEMBERS</div>
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Footer Matrix Status Bar */}
      <div className="flex items-center justify-between pt-1.5 border-t border-[#082B52] z-20 relative text-[9.5px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>VEL TECH HIGH TECH HUB</span>
        </div>
        <span className="hidden sm:inline">LATENCY: 12MS</span>
      </div>

      <style jsx global>{`
        @keyframes sparkTravel {
          0% {
            stroke-dashoffset: 160;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-spark-travel {
          animation: sparkTravel 3.6s linear infinite;
        }
        @keyframes pulseRingHome {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .animate-pulse-ring-home {
          transform-origin: center;
          animation: pulseRingHome 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
