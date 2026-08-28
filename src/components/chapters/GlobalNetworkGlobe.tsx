'use client';

import React, { useEffect, useRef } from 'react';

// Geographic latitude and longitude coordinates for major ACM student chapter hubs worldwide
const CHAPTER_HUBS = [
  { name: 'North America West', lat: 37.7749, lon: -122.4194 },
  { name: 'North America East', lat: 40.7128, lon: -74.006 },
  { name: 'Canada Hub', lat: 43.6532, lon: -79.3832 },
  { name: 'Europe Central', lat: 47.3769, lon: 8.5417 },
  { name: 'UK Hub', lat: 51.5074, lon: -0.1278 },
  { name: 'Germany Hub', lat: 52.52, lon: 13.405 },
  { name: 'Asia South (India)', lat: 13.0827, lon: 80.2707 },
  { name: 'India Tech Hub', lat: 12.9716, lon: 77.5946 },
  { name: 'Asia East (Japan)', lat: 35.6762, lon: 139.6503 },
  { name: 'Asia East (Singapore)', lat: 1.3521, lon: 103.8198 },
  { name: 'Australia Hub', lat: -33.8688, lon: 151.2093 },
  { name: 'South America Hub', lat: -23.5505, lon: -46.6333 },
  { name: 'Africa Hub', lat: -33.9249, lon: 18.4241 },
];

// Curated grid points forming continent shape point clouds
function generateContinentPoints() {
  const points: { lat: number; lon: number }[] = [];
  
  const continentBoxes = [
    // North America
    { minLat: 15, maxLat: 65, minLon: -130, maxLon: -60, density: 45 },
    // South America
    { minLat: -50, maxLat: 10, minLon: -80, maxLon: -35, density: 30 },
    // Europe
    { minLat: 35, maxLat: 65, minLon: -10, maxLon: 40, density: 40 },
    // Africa
    { minLat: -35, maxLat: 35, minLon: -18, maxLon: 50, density: 40 },
    // Asia & India
    { minLat: 8, maxLat: 65, minLon: 60, maxLon: 140, density: 75 },
    // Australia
    { minLat: -40, maxLat: -12, minLon: 112, maxLon: 154, density: 25 },
  ];

  continentBoxes.forEach((box) => {
    for (let i = 0; i < box.density; i++) {
      const lat = box.minLat + Math.random() * (box.maxLat - box.minLat);
      const lon = box.minLon + Math.random() * (box.maxLon - box.minLon);
      points.push({ lat, lon });
    }
  });

  return points;
}

// Connections between chapter hubs
const CONNECTIONS = [
  [0, 1], // NA West -> NA East
  [1, 4], // NA East -> UK
  [4, 3], // UK -> Central Europe
  [3, 6], // Europe -> India
  [6, 7], // India -> Bangalore
  [7, 9], // India -> Singapore
  [9, 8], // Singapore -> Japan
  [8, 10], // Japan -> Australia
  [1, 11], // NA East -> South America
  [3, 12], // Europe -> Africa
  [0, 8], // NA West -> Japan
];

export default function GlobalNetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationY = 0.4;
    const tiltX = 0.35; // ~20 deg tilt

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionPreference);

    const continentPoints = generateContinentPoints();

    // Floating particles
    const particles = Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * 2.2,
      y: (Math.random() - 0.5) * 2.2,
      z: (Math.random() - 0.5) * 2.2,
      size: 0.8 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.5,
      speed: 0.0005 + Math.random() * 0.001,
    }));

    // Data packet progress along connections
    const packets = CONNECTIONS.map(() => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth || 360;
      const height = parent.clientHeight || 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Spherical Projection Helper
    const project3D = (lat: number, lon: number, radius: number, cx: number, cy: number) => {
      const radLat = (lat * Math.PI) / 180;
      const radLon = (lon * Math.PI) / 180 + rotationY;

      // Unrotated 3D point on unit sphere
      const x0 = Math.cos(radLat) * Math.sin(radLon);
      const y0 = Math.sin(radLat);
      const z0 = Math.cos(radLat) * Math.cos(radLon);

      // Apply tiltX around X-axis
      const y1 = y0 * Math.cos(tiltX) - z0 * Math.sin(tiltX);
      const z1 = y0 * Math.sin(tiltX) + z0 * Math.cos(tiltX);
      const x1 = x0;

      // Perspective scale
      const fov = 350;
      const scale = fov / (fov - z1 * radius * 0.4);

      return {
        x: cx + x1 * radius * scale,
        y: cy - y1 * radius * scale,
        z: z1, // z > 0 is front side facing viewer
        scale,
      };
    };

    let pulseTime = 0;

    const render = () => {
      const width = parseFloat(canvas.style.width) || 360;
      const height = parseFloat(canvas.style.height) || 360;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Radial Glow Behind Globe
      const radialGlow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
      radialGlow.addColorStop(0, 'rgba(0, 174, 239, 0.18)');
      radialGlow.addColorStop(0.5, 'rgba(7, 21, 45, 0.12)');
      radialGlow.addColorStop(1, 'rgba(5, 11, 26, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Outer atmosphere rim circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 174, 239, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. Latitude & Longitude Digital Grid Lines
      const latRings = [-45, -22.5, 0, 22.5, 45];
      latRings.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 10) {
          const pt = project3D(lat, lon, radius, cx, cy);
          if (pt.z > -0.2) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(0, 174, 239, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const lonMeridians = [-135, -90, -45, 0, 45, 90, 135, 180];
      lonMeridians.forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 10) {
          const pt = project3D(lat, lon, radius, cx, cy);
          if (pt.z > -0.2) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(0, 174, 239, 0.1)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Continent Point Cloud (Digital Dots)
      continentPoints.forEach((pt) => {
        const p3d = project3D(pt.lat, pt.lon, radius, cx, cy);
        if (p3d.z > -0.15) {
          const alpha = Math.max(0.1, (p3d.z + 0.2) * 0.7);
          ctx.beginPath();
          ctx.arc(p3d.x, p3d.y, 1.2 * p3d.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 243, ${alpha})`;
          ctx.fill();
        }
      });

      // 4. Chapter Hub Nodes & Connecting Arcs
      const projectedHubs = CHAPTER_HUBS.map((hub) => project3D(hub.lat, hub.lon, radius, cx, cy));

      // Draw Arcs & Flying Packets
      CONNECTIONS.forEach(([i, j], idx) => {
        const h1 = projectedHubs[i];
        const h2 = projectedHubs[j];

        if (h1.z > -0.3 || h2.z > -0.3) {
          const midX = (h1.x + h2.x) / 2;
          const midY = (h1.y + h2.y) / 2 - Math.hypot(h2.x - h1.x, h2.y - h1.y) * 0.18;

          const arcAlpha = Math.min(Math.max(0.05, h1.z + 0.3), Math.max(0.05, h2.z + 0.3)) * 0.55;

          ctx.beginPath();
          ctx.moveTo(h1.x, h1.y);
          ctx.quadraticCurveTo(midX, midY, h2.x, h2.y);
          ctx.strokeStyle = `rgba(0, 174, 239, ${arcAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Data Packet Spark
          if (!isReducedMotion) {
            packets[idx].progress = (packets[idx].progress + packets[idx].speed) % 1;
          }
          const t = packets[idx].progress;
          // Quadratic Bezier interpolation
          const px = (1 - t) * (1 - t) * h1.x + 2 * (1 - t) * t * midX + t * t * h2.x;
          const py = (1 - t) * (1 - t) * h1.y + 2 * (1 - t) * t * midY + t * t * h2.y;

          if (h1.z > -0.1 && h2.z > -0.1) {
            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#00AEEF';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Render Hub Pulsing Nodes
      pulseTime += 0.03;
      const pulseFactor = Math.sin(pulseTime) * 0.5 + 0.5;

      projectedHubs.forEach((hub) => {
        if (hub.z > -0.1) {
          const nodeAlpha = Math.min(1, (hub.z + 0.1) * 1.2);
          
          // Outer pulse ring
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, (4 + pulseFactor * 4) * hub.scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 174, 239, ${0.4 * nodeAlpha * (1 - pulseFactor)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Core node
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 3 * hub.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 243, ${nodeAlpha})`;
          ctx.shadowColor = '#00AEEF';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Subtle Ambient Data Particles
      particles.forEach((p) => {
        if (!isReducedMotion) {
          p.z -= p.speed;
          if (p.z < -1) p.z = 1;
        }

        // Rotate particle position with globe
        const radLon = rotationY;
        const rx = p.x * Math.cos(radLon) + p.z * Math.sin(radLon);
        const rz = -p.x * Math.sin(radLon) + p.z * Math.cos(radLon);

        const px = cx + rx * radius * 1.35;
        const py = cy + p.y * radius * 1.35;

        if (rz > -0.5) {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * (rz + 0.6)})`;
          ctx.fill();
        }
      });

      // Update globe rotation if not reduced motion
      if (!isReducedMotion) {
        rotationY += 0.0025;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      mediaQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] mx-auto flex items-center justify-center select-none pointer-events-none">
      
      {/* 1. Subtle Radial Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/10 via-[#07152D]/40 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* 2. Interactive Canvas Visual */}
      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />

      {/* 3. Floating Connection Node Badge 1: STUDENT CHAPTERS (Top Left) */}
      <div className="absolute top-[8%] left-[2%] z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07152D]/85 backdrop-blur-md border border-[#00AEEF]/30 text-white shadow-lg shadow-cyan-950/40 animate-pulse-slow">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16C7F3] shadow-[0_0_6px_#00AEEF]" />
        <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-200 uppercase">STUDENT CHAPTERS</span>
      </div>

      {/* 4. Floating Connection Node Badge 2: GLOBAL NETWORK (Top / Mid Right) */}
      <div className="absolute top-[22%] right-[0%] z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07152D]/85 backdrop-blur-md border border-[#00AEEF]/30 text-white shadow-lg shadow-cyan-950/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase">GLOBAL NETWORK</span>
      </div>

      {/* 5. Floating Connection Node Badge 3: COMMUNITIES (Bottom Left) */}
      <div className="absolute bottom-[10%] left-[4%] z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07152D]/85 backdrop-blur-md border border-[#00AEEF]/30 text-white shadow-lg shadow-cyan-950/40">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
        <span className="text-[10px] font-mono font-bold tracking-wider text-sky-200 uppercase">COMMUNITIES</span>
      </div>
    </div>
  );
}
