'use client';

import React from 'react';

export default function ConnectedNodesBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* ── 1. ATMOSPHERIC RADIAL GLOWS (OUTER MARGINS ONLY) ── */}
      {/* Top Left Subtle Ambient Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] bg-[#00A3E0]/12 rounded-full blur-[140px] opacity-80" />
      
      {/* Right Column Campus Card Backdrop Ambient Glow (Behind Card, NOT Over Photo) */}
      <div className="hidden lg:block absolute top-[10%] right-[2%] w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[150px] opacity-75" />

      {/* Bottom Center Depth Glow */}
      <div className="absolute bottom-[-10%] left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] opacity-60" />

      {/* Ultra-Low Contrast IDE Grid Pattern */}
      <div className="absolute inset-0 acm-pattern-grid opacity-[0.06] sm:opacity-[0.08]" />

      {/* ── 2. DESKTOP & TABLET EDGE-CONSTRAINED CIRCUIT NETWORK (DESKTOP >= 768px) ── */}
      {/* SVG canvas designed so network traces remain in empty outer margins and around card perimeter */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <svg
          className="w-full h-full text-cyan-400"
          viewBox="0 0 1440 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="edge-bus-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#005596" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="edge-vert-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ── TOP MARGIN BUS TRACE (Above Text & Campus Photo) ── */}
          <path
            d="M 0 45 H 280 L 330 85 H 720 L 770 35 H 1440"
            stroke="url(#edge-bus-grad)"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            className="animate-dash-flow"
          />
          <path
            d="M 140 20 H 460 L 500 55 H 1020 L 1060 20 H 1440"
            stroke="#00F0FF"
            strokeWidth="0.8"
            opacity="0.2"
          />

          {/* ── FAR LEFT MARGIN VERTICAL TRACE ── */}
          <path
            d="M 45 0 V 240 L 90 290 V 680"
            stroke="url(#edge-vert-grad)"
            strokeWidth="1.2"
            opacity="0.3"
          />

          {/* ── FAR RIGHT MARGIN VERTICAL TRACE (Outside Campus Card Right Edge) ── */}
          <path
            d="M 1395 0 V 290 L 1350 340 V 680"
            stroke="url(#edge-vert-grad)"
            strokeWidth="1.2"
            opacity="0.3"
          />

          {/* ── SUBTLE GEOMETRIC ARC FRAMING THE DESKTOP CAMPUS CARD PERIMETER ── */}
          {/* Sits safely outside the campus card area (Card is between x: 680 and 1300, y: 90 and 560) */}
          <path
            d="M 660 70 C 640 160 640 480 660 580"
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.25"
          />
          <path
            d="M 1320 70 C 1340 160 1340 480 1320 580"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.25"
          />

          {/* ── BOTTOM MARGIN BUS TRACE (Below Hero Content & Campus Photo) ── */}
          <path
            d="M 0 620 H 400 L 450 575 H 960 L 1010 620 H 1440"
            stroke="url(#edge-bus-grad)"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
          <path
            d="M 200 650 H 640 L 680 610 H 1240"
            stroke="#38BDF8"
            strokeWidth="0.8"
            opacity="0.2"
          />

          {/* ── PERIMETER JUNCTION NODES (In Outer Margins Only) ── */}
          <circle cx="330" cy="85" r="4" fill="#00F0FF" className="animate-pulse" />
          <circle cx="770" cy="35" r="3.5" fill="#38BDF8" />
          <circle cx="90" cy="290" r="4" fill="#00F0FF" className="animate-pulse-glow" />
          <circle cx="1350" cy="340" r="4" fill="#38BDF8" className="animate-pulse-glow" />
          <circle cx="450" cy="575" r="3.5" fill="#10B981" />
          <circle cx="1010" cy="620" r="4" fill="#00F0FF" className="animate-pulse" />

          {/* Tech Anchor Crosshairs (+) on Perimeter Nodes */}
          <g stroke="#00F0FF" strokeWidth="0.8" opacity="0.4">
            <line x1="324" y1="85" x2="336" y2="85" />
            <line x1="330" y1="79" x2="330" y2="91" />

            <line x1="1344" y1="340" x2="1356" y2="340" />
            <line x1="1350" y1="334" x2="1350" y2="346" />

            <line x1="1004" y1="620" x2="1016" y2="620" />
            <line x1="1010" y1="614" x2="1010" y2="626" />
          </g>

          {/* ── SLOW DATA PACKET PARTICLES ALONG MARGIN BUS LINES ── */}
          <circle r="2.5" fill="#FFFFFF" opacity="0.9">
            <animateMotion
              path="M 0 45 H 280 L 330 85 H 720 L 770 35 H 1440"
              dur="16s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2" fill="#00F0FF" opacity="0.8">
            <animateMotion
              path="M 0 620 H 400 L 450 575 H 960 L 1010 620 H 1440"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2" fill="#38BDF8" opacity="0.75">
            <animateMotion
              path="M 45 0 V 240 L 90 290 V 680"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* ── 3. MOBILE ULTRA-CLEAN BACKGROUND (SCREENS < 768px) ── */}
      {/* Ensures zero globe behind text, zero line overlap, 100% clean typography area */}
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <svg
          className="w-full h-full text-cyan-400"
          viewBox="0 0 430 750"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Sparse Top Edge Trace */}
          <path
            d="M 0 25 H 140 L 170 50 H 430"
            stroke="#00F0FF"
            strokeWidth="1"
            opacity="0.25"
            strokeDasharray="4 4"
          />

          {/* Sparse Bottom Edge Trace */}
          <path
            d="M 0 710 H 260 L 290 685 H 430"
            stroke="#38BDF8"
            strokeWidth="1"
            opacity="0.25"
            strokeDasharray="4 4"
          />

          {/* Small Edge Dots */}
          <circle cx="170" cy="50" r="3" fill="#00F0FF" opacity="0.6" />
          <circle cx="290" cy="685" r="3" fill="#38BDF8" opacity="0.6" />

          {/* Slow Edge Particle */}
          <circle r="2" fill="#FFFFFF" opacity="0.8">
            <animateMotion
              path="M 0 25 H 140 L 170 50 H 430"
              dur="14s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}
