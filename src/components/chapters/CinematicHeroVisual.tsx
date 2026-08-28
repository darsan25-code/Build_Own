'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Globe, Users, Building2, CheckCircle2 } from 'lucide-react';

// Continent points generator for realistic density cluster
function generateWorldClusters() {
  const clusters: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
  
  // Define lat/long boxes for world continents
  const regions = [
    // NA
    { minLat: 15, maxLat: 65, minLon: -130, maxLon: -60, count: 120 },
    // SA
    { minLat: -45, maxLat: 10, minLon: -80, maxLon: -35, count: 80 },
    // EU
    { minLat: 35, maxLat: 65, minLon: -10, maxLon: 45, count: 140 },
    // Africa
    { minLat: -32, maxLat: 35, minLon: -15, maxLon: 48, count: 100 },
    // Asia & India
    { minLat: 5, maxLat: 65, minLon: 60, maxLon: 140, count: 220 },
    // Aus
    { minLat: -38, maxLat: -12, minLon: 112, maxLon: 152, count: 60 },
  ];

  const R = 180; // Radius of digital globe sphere

  regions.forEach((r) => {
    for (let i = 0; i < r.count; i++) {
      const lat = r.minLat + Math.random() * (r.maxLat - r.minLat);
      const lon = r.minLon + Math.random() * (r.maxLon - r.minLon);
      
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      // Convert lat/long to 3D sphere point
      const x = -(R * Math.sin(phi) * Math.cos(theta));
      const z = R * Math.sin(phi) * Math.sin(theta);
      const y = R * Math.cos(phi);

      clusters.push({
        x,
        y,
        z,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.35,
      });
    }
  });

  return clusters;
}

// Major university hub nodes
const UNIVERSITY_HUBS = [
  { lat: 37.77, lon: -122.41, name: 'Stanford / UC Berkeley' },
  { lat: 40.71, lon: -74.0, name: 'MIT / Columbia' },
  { lat: 51.5, lon: -0.12, name: 'Oxford / Cambridge' },
  { lat: 47.37, lon: 8.54, name: 'ETH Zurich' },
  { lat: 13.08, lon: 80.27, name: 'IIT Madras / Vel Tech ACM' },
  { lat: 12.97, lon: 77.59, name: 'IISc Bangalore' },
  { lat: 35.67, lon: 139.65, name: 'University of Tokyo' },
  { lat: 1.35, lon: 103.81, name: 'NUS Singapore' },
  { lat: -33.86, lon: 151.2, name: 'University of Sydney' },
];

export default function CinematicHeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotY = 0.5;
    const tiltX = 0.38; // 22 deg tilt

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;
    const handleMotion = (e: MediaQueryListEvent) => { isReducedMotion = e.matches; };
    mediaQuery.addEventListener('change', handleMotion);

    const worldPoints = generateWorldClusters();

    // Ambient floating particles
    const ambientParticles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      z: (Math.random() - 0.5) * 500,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      vy: -(Math.random() * 0.2 + 0.05),
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth || 520;
      const h = parent.clientHeight || 520;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Projection helper
    const project = (x: number, y: number, z: number, cx: number, cy: number, R: number) => {
      // Rotate around Y-axis
      const radY = rotY;
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotate around X-axis (tiltX)
      const y2 = y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
      const z2 = y * Math.sin(tiltX) + z1 * Math.cos(tiltX);
      const x2 = x1;

      const fov = 480;
      const scale = fov / (fov - z2 * 0.5);

      return {
        px: cx + x2 * scale,
        py: cy - y2 * scale,
        pz: z2,
        scale,
      };
    };

    let pulse = 0;

    const render = () => {
      const w = parseFloat(canvas.style.width) || 520;
      const h = parseFloat(canvas.style.height) || 520;
      const cx = w * 0.52;
      const cy = h * 0.5;
      const R = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      // 1. Cinematic Radial Cyan Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.4);
      glowGrad.addColorStop(0, 'rgba(0, 174, 239, 0.22)');
      glowGrad.addColorStop(0.4, 'rgba(7, 21, 45, 0.15)');
      glowGrad.addColorStop(1, 'rgba(5, 11, 26, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Latitude & Longitude Digital Grid Rings
      const lats = [-50, -25, 0, 25, 50];
      lats.forEach((lat) => {
        const radLat = (lat * Math.PI) / 180;
        const rLat = R * Math.cos(radLat);
        const yLat = R * Math.sin(radLat);

        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 8) {
          const radLon = (lon * Math.PI) / 180;
          const px3d = -(rLat * Math.sin(radLon));
          const pz3d = rLat * Math.cos(radLon);
          const pt = project(px3d, yLat, pz3d, cx, cy, R);

          if (pt.pz > -R * 0.4) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(0, 174, 239, 0.14)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Render World Cluster Points (Digital Continents)
      worldPoints.forEach((p) => {
        const pt = project(p.x, p.y, p.z, cx, cy, R);
        if (pt.pz > -R * 0.3) {
          const alpha = Math.max(0.1, (pt.pz / R + 0.4) * p.alpha);
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, p.size * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 243, ${alpha})`;
          ctx.fill();
        }
      });

      // 4. University Hub Nodes & Arcs
      const hubProjected = UNIVERSITY_HUBS.map((h) => {
        const phi = (90 - h.lat) * (Math.PI / 180);
        const theta = (h.lon + 180) * (Math.PI / 180);
        const x = -(R * Math.sin(phi) * Math.cos(theta));
        const z = R * Math.sin(phi) * Math.sin(theta);
        const y = R * Math.cos(phi);
        return project(x, y, z, cx, cy, R);
      });

      // Draw Arcs between hubs
      for (let i = 0; i < hubProjected.length - 1; i++) {
        const h1 = hubProjected[i];
        const h2 = hubProjected[i + 1];

        if (h1.pz > -R * 0.2 || h2.pz > -R * 0.2) {
          const midX = (h1.px + h2.px) / 2;
          const midY = (h1.py + h2.py) / 2 - 35;

          const opacity = Math.min(1, Math.max(0.1, (h1.pz / R + 0.5)));
          ctx.beginPath();
          ctx.moveTo(h1.px, h1.py);
          ctx.quadraticCurveTo(midX, midY, h2.px, h2.py);
          ctx.strokeStyle = `rgba(0, 174, 239, ${0.45 * opacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw Pulsing Nodes for Hubs
      pulse += 0.04;
      const pulseVal = Math.sin(pulse) * 0.5 + 0.5;

      hubProjected.forEach((h) => {
        if (h.pz > -R * 0.1) {
          const alpha = Math.min(1, (h.pz / R + 0.4));
          
          // Outer pulse circle
          ctx.beginPath();
          ctx.arc(h.px, h.py, (4 + pulseVal * 5) * h.scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 174, 239, ${0.5 * alpha * (1 - pulseVal)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Node core
          ctx.beginPath();
          ctx.arc(h.px, h.py, 3.5 * h.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 243, ${alpha})`;
          ctx.shadowColor = '#00AEEF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Ambient Floating Particles
      ambientParticles.forEach((ap) => {
        if (!isReducedMotion) {
          ap.y += ap.vy;
          if (ap.y < -250) ap.y = 250;
        }
        const pt = project(ap.x, ap.y, ap.z, cx, cy, R);
        if (pt.pz > -R * 0.5) {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, ap.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${ap.alpha})`;
          ctx.fill();
        }
      });

      if (!isReducedMotion) {
        rotY += 0.002;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      mediaQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setParallax({ x: ny * -5, y: nx * 6 });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] flex items-center justify-center select-none overflow-visible group"
      style={{
        transform: `perspective(1200px) rotateX(${parallax.x}deg) rotateY(${parallax.y}deg)`,
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      {/* Background Volumetric Cyan Halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/15 via-[#07152D]/40 to-transparent rounded-3xl blur-3xl pointer-events-none" />

      {/* 3D Canvas Visualization */}
      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />

      {/* Integrated Glassmorphism Information Panels */}

      {/* Glass UI Panel 1: Top Right - 1,000+ Student Chapters */}
      <div className="absolute top-[6%] right-[2%] z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#07152D]/85 backdrop-blur-xl border border-[#00AEEF]/35 shadow-2xl shadow-cyan-950/50 hover:border-[#00AEEF]/60 transition-all duration-300">
        <div className="w-8 h-8 rounded-xl bg-[#00AEEF]/15 text-[#16C7F3] border border-[#00AEEF]/30 flex items-center justify-center font-bold flex-shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-extrabold text-white tracking-tight">1,000+</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          </div>
          <div className="text-[10px] font-mono font-semibold text-slate-300 tracking-wide uppercase">
            Student Chapters
          </div>
        </div>
      </div>

      {/* Glass UI Panel 2: Bottom Left - 50,000+ Active Members */}
      <div className="absolute bottom-[8%] left-[2%] z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#07152D]/85 backdrop-blur-xl border border-[#00AEEF]/35 shadow-2xl shadow-cyan-950/50 hover:border-[#00AEEF]/60 transition-all duration-300">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold flex-shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-mono font-extrabold text-white tracking-tight">50,000+</div>
          <div className="text-[10px] font-mono font-semibold text-slate-300 tracking-wide uppercase">
            Student Members
          </div>
        </div>
      </div>

      {/* Glass UI Panel 3: Mid Right - Global Network Status */}
      <div className="absolute bottom-[28%] right-[0%] z-20 hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#07152D]/85 backdrop-blur-xl border border-[#00AEEF]/30 text-white shadow-xl">
        <Globe className="w-4 h-4 text-[#16C7F3]" />
        <span className="text-[10px] font-mono font-bold text-slate-200 tracking-wider uppercase">
          100+ COUNTRIES CONNECTED
        </span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
      </div>
    </div>
  );
}
