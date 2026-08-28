'use client';

import React from 'react';

export default function ContestBackgroundDecoration() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* ── 1. DARK TECH ATMOSPHERIC LIGHTING ── */}
      {/* Primary Hero Right Cyber Glow (Hologram Source) */}
      <div className="absolute top-10 right-[-5%] sm:right-[2%] lg:right-[8%] w-[500px] sm:w-[650px] lg:w-[750px] h-[500px] sm:h-[650px] lg:h-[750px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-emerald-500/10 rounded-full blur-[140px] opacity-80" />
      
      {/* Top Left Ambient Halo */}
      <div className="absolute top-4 left-[-10%] sm:left-[5%] w-[450px] lg:w-[550px] h-[450px] lg:h-[550px] bg-blue-700/15 rounded-full blur-[150px] opacity-70" />
      
      {/* Bottom Center Contest Grid Ambient Glow */}
      <div className="absolute top-[45%] left-1/3 w-[600px] h-[600px] bg-[#005596]/10 rounded-full blur-[160px] opacity-60" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] opacity-50" />

      {/* ── 2. DIGITAL COMPUTATIONAL GRID (Low Contrast IDE Canvas) ── */}
      <div className="absolute inset-0 opacity-[0.04] sm:opacity-[0.06]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="acm-cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
              <circle cx="40" cy="0" r="1" fill="#00F0FF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#acm-cyber-grid)" />
        </svg>
      </div>

      {/* ── 3. HOLOGRAPHIC CENTERPIECE (HERO RIGHT SIDE) ── */}
      <div className="absolute top-8 right-[-5%] sm:right-[2%] lg:right-[6%] xl:right-[10%] w-[380px] sm:w-[480px] lg:w-[580px] xl:w-[640px] h-[380px] sm:h-[480px] lg:h-[580px] xl:h-[640px] pointer-events-none opacity-50 sm:opacity-80 lg:opacity-100 transition-all duration-300">
        
        {/* Holographic Glowing Base Pedestal */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-24 bg-gradient-to-t from-cyan-500/25 via-blue-500/10 to-transparent rounded-[100%] border border-cyan-400/30 blur-[2px] shadow-[0_0_50px_rgba(0,240,255,0.25)]" />
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 w-[55%] h-14 rounded-[100%] border border-sky-300/40 opacity-80" />
        <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 w-[40%] h-8 rounded-[100%] border border-cyan-400/50 border-dashed animate-spin-slow opacity-60" />

        {/* Central Holographic Globe Sphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-72 xl:w-80 h-48 sm:h-64 lg:h-72 xl:h-80 rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-600/15 to-indigo-900/30 border border-cyan-300/40 shadow-[0_0_80px_rgba(0,240,255,0.35)] flex items-center justify-center backdrop-blur-[2px]">
          
          {/* Globe Latitude & Longitude Wireframe Lines */}
          <svg className="w-full h-full text-cyan-400/60 p-2 transform -rotate-12" viewBox="0 0 200 200" fill="none">
            {/* Outer Globe Rim */}
            <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" className="opacity-60" />
            
            {/* Longitude Ellipses */}
            <ellipse cx="100" cy="100" rx="94" ry="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <ellipse cx="100" cy="100" rx="70" ry="94" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <ellipse cx="100" cy="100" rx="40" ry="94" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="100" cy="100" rx="15" ry="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            
            {/* Latitude Ellipses */}
            <ellipse cx="100" cy="100" rx="94" ry="70" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <ellipse cx="100" cy="100" rx="94" ry="40" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="100" cy="100" rx="94" ry="15" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            
            {/* Equator & Prime Meridian Lines */}
            <line x1="6" y1="100" x2="194" y2="100" stroke="#00F0FF" strokeWidth="1.2" opacity="0.7" strokeDasharray="4 2" />
            <line x1="100" y1="6" x2="100" y2="194" stroke="#00F0FF" strokeWidth="1.2" opacity="0.7" strokeDasharray="4 2" />

            {/* Glowing Network Nodes on Globe Surface */}
            <circle cx="100" cy="40" r="3" fill="#00F0FF" className="animate-ping" />
            <circle cx="100" cy="40" r="2.5" fill="#FFFFFF" />
            
            <circle cx="145" cy="80" r="3.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="60" cy="130" r="3" fill="#10B981" />
            <circle cx="160" cy="120" r="2.5" fill="#F59E0B" />
            <circle cx="70" cy="70" r="3" fill="#00F0FF" />
          </svg>
        </div>

        {/* Outer Orbital Rings (Rotating angled HUD rings) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full text-sky-400 transform rotate-12" viewBox="0 0 600 600" fill="none">
            {/* Main Outer Ring */}
            <ellipse cx="300" cy="300" rx="270" ry="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 8" className="opacity-60 animate-spin-slow" />
            
            {/* Secondary Counter-Rotating Ring */}
            <ellipse cx="300" cy="300" rx="245" ry="245" stroke="#00F0FF" strokeWidth="1" strokeDasharray="6 12" className="opacity-40 animate-spin-reverse" />
            
            {/* Inner Ring with Target Crosshairs */}
            <ellipse cx="300" cy="300" rx="190" ry="280" stroke="currentColor" strokeWidth="1" className="opacity-25" />
            <path d="M 50 300 H 550 M 300 50 V 550" stroke="#38BDF8" strokeWidth="0.8" opacity="0.2" />

            {/* Orbiting Satellite Data Nodes */}
            <circle cx="300" cy="55" r="6" fill="#00F0FF" className="animate-pulse-glow" />
            <circle cx="545" cy="300" r="5" fill="#10B981" />
            <circle cx="300" cy="545" r="5.5" fill="#38BDF8" />
            <circle cx="55" cy="300" r="4.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Floating Sci-Fi Tech Callout Code Window (Hero Right) */}
        <div className="hidden lg:block absolute top-[12%] right-[5%] w-[210px] p-3 rounded-xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)] animate-float-slow">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500/80" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] font-mono text-cyan-300/80 tracking-wider">solution.cpp</span>
          </div>
          <pre className="font-mono text-[10px] text-cyan-200/90 leading-tight space-y-0.5">
            <span className="text-purple-400">for</span> <span className="text-slate-300">(int i = 0; i &lt; m; i++) &#123;</span><br />
            <span className="text-purple-400">  if</span> <span className="text-slate-300">(dp[i] &gt; best)</span><br />
            <span className="text-cyan-400">    best = dp[i];</span><br />
            <span className="text-slate-300">&#125;</span>
          </pre>
        </div>

        {/* Floating Complexity Annotations */}
        <div className="hidden xl:block absolute top-[8%] right-[44%] font-mono text-[11px] font-bold text-cyan-300/70 tracking-widest bg-slate-900/60 border border-cyan-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm animate-float-delayed">
          O(log n)
        </div>
        <div className="hidden xl:block absolute top-[42%] right-[-4%] font-mono text-[10px] font-bold text-sky-300/60 tracking-wider bg-slate-900/60 border border-sky-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm animate-float-slow">
          O(n log n)
        </div>
        <div className="hidden xl:block absolute bottom-[18%] right-[48%] font-mono text-[10px] font-bold text-emerald-400/60 tracking-wider bg-slate-900/60 border border-emerald-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm animate-float-delayed">
          O(n²)
        </div>

        {/* Floating Binary Bits Stream */}
        <div className="hidden lg:block absolute top-[58%] right-[2%] font-mono text-[10px] font-extrabold text-cyan-400/40 leading-none tracking-widest text-right select-none">
          010101<br />101010<br />001101
        </div>
      </div>

      {/* ── 4. CIRCUIT NETWORK & ANIMATED DATA FLOW PATHS ── */}
      <div className="absolute inset-0 w-full h-full opacity-40 sm:opacity-60">
        <svg className="w-full h-full text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            {/* Linear Gradients for Circuit Traces */}
            <linearGradient id="circuit-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#005596" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="circuit-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Top Horizontal Main Bus Trace */}
          <path
            d="M 0 140 H 280 L 340 200 H 780 L 840 140 H 1440"
            stroke="url(#circuit-grad-1)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8 4"
            className="animate-dash-flow"
          />

          {/* Left Margin Vertical Circuit Trace */}
          <path
            d="M 40 0 V 380 L 90 430 V 900"
            stroke="url(#circuit-grad-2)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />

          {/* Right Margin Vertical Circuit Trace */}
          <path
            d="M 1400 0 V 420 L 1350 470 V 900"
            stroke="url(#circuit-grad-2)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />

          {/* Inter-Section Horizontal Branch Traces (Behind Contest Filter Tabs & Cards) */}
          <path
            d="M 120 540 H 420 L 460 580 H 1000 L 1040 540 H 1320"
            stroke="#00F0FF"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
            strokeDasharray="6 6"
          />
          <path
            d="M 200 780 H 500 L 540 820 H 940 L 980 780 H 1240"
            stroke="#38BDF8"
            strokeWidth="1"
            fill="none"
            opacity="0.25"
            strokeDasharray="4 4"
          />

          {/* Connected Circuit Junction Nodes (Glowing points) */}
          <circle cx="340" cy="200" r="4.5" fill="#00F0FF" className="animate-pulse" />
          <circle cx="780" cy="200" r="4" fill="#10B981" />
          <circle cx="840" cy="140" r="4.5" fill="#38BDF8" className="animate-pulse" />
          <circle cx="90" cy="430" r="4" fill="#00F0FF" />
          <circle cx="1350" cy="470" r="4" fill="#38BDF8" className="animate-pulse" />
          <circle cx="460" cy="580" r="3.5" fill="#10B981" />
          <circle cx="1040" cy="540" r="3.5" fill="#00F0FF" />
          
          {/* Small Crosshair Technical Anchors (+) */}
          <g stroke="#00F0FF" strokeWidth="1" opacity="0.4">
            <line x1="335" y1="200" x2="345" y2="200" />
            <line x1="340" y1="195" x2="340" y2="205" />

            <line x1="1345" y1="470" x2="1355" y2="470" />
            <line x1="1350" y1="465" x2="1350" y2="475" />
          </g>

          {/* Animated Data Packets Traveling Along Paths */}
          <circle r="3" fill="#FFFFFF">
            <animateMotion
              path="M 0 140 H 280 L 340 200 H 780 L 840 140 H 1440"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#00F0FF">
            <animateMotion
              path="M 40 0 V 380 L 90 430 V 900"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#38BDF8">
            <animateMotion
              path="M 1400 0 V 420 L 1350 470 V 900"
              dur="16s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* ── 5. FLOATING TECHNICAL SYNTAX FRAGMENTS ── */}
      <div className="hidden md:block">
        {/* Code token: </> */}
        <div className="absolute top-28 left-[14%] font-mono text-xs font-black text-cyan-400/40 tracking-widest select-none animate-float-slow">
          &lt;/&gt;
        </div>

        {/* Code token: { } */}
        <div className="absolute top-64 left-[3%] font-mono text-sm font-black text-sky-400/35 tracking-widest select-none animate-float-delayed">
          &#123; &#125;
        </div>

        {/* Code token: 0101 */}
        <div className="absolute top-[48%] left-[2%] font-mono text-[11px] font-extrabold text-emerald-400/35 tracking-wider select-none animate-float-slow">
          0101 :: fn()
        </div>

        {/* Code token: => [ ] */}
        <div className="absolute top-[68%] left-[4%] font-mono text-[11px] font-extrabold text-amber-400/35 tracking-widest select-none animate-float-delayed">
          =&gt; &#91; &#93;
        </div>

        {/* Code token: ( ) ; */}
        <div className="absolute top-[52%] right-[3%] font-mono text-xs font-bold text-cyan-400/35 tracking-widest select-none animate-float-slow">
          ( ) ;
        </div>

        {/* Code token: return 0; */}
        <div className="absolute top-[78%] right-[4%] font-mono text-[11px] font-bold text-blue-400/35 tracking-wider select-none animate-float-delayed">
          return 0;
        </div>
      </div>
    </div>
  );
}
