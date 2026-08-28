'use client';

import React, { useEffect, useRef } from 'react';

export default function HomeCinematicVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;
    const handleMotion = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotion);

    // Particle system
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 520,
      y: Math.random() * 320,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    // Data streams (light trails flowing across)
    const streamCount = 5;
    const streams = Array.from({ length: streamCount }, (_, i) => ({
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      yOffset: (i - 2) * 45,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth || 520;
      const h = parent.clientHeight || 325;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      const w = parseFloat(canvas.style.width) || 520;
      const h = parseFloat(canvas.style.height) || 325;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      // 1. Central Volumetric Cyan Light Core Glow
      time += 0.02;
      const corePulse = Math.sin(time) * 0.15 + 0.85;

      const coreGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.45);
      coreGlow.addColorStop(0, `rgba(22, 199, 243, ${0.45 * corePulse})`);
      coreGlow.addColorStop(0.3, `rgba(0, 174, 239, ${0.22 * corePulse})`);
      coreGlow.addColorStop(0.7, 'rgba(7, 21, 45, 0.08)');
      coreGlow.addColorStop(1, 'rgba(5, 11, 26, 0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // 2. Fine Curved Network Stream Lines
      streams.forEach((st) => {
        if (!isReducedMotion) {
          st.progress = (st.progress + st.speed) % 1;
        }

        ctx.beginPath();
        ctx.moveTo(0, cy + st.yOffset + Math.sin(time + st.yOffset) * 15);
        ctx.quadraticCurveTo(
          cx,
          cy + st.yOffset - 35 + Math.cos(time) * 20,
          w,
          cy + st.yOffset + Math.sin(time * 0.8) * 15
        );
        ctx.strokeStyle = 'rgba(0, 174, 239, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Traveling Light Packet Spark along stream
        const t = st.progress;
        const p1x = 0, p1y = cy + st.yOffset + Math.sin(time + st.yOffset) * 15;
        const p2x = cx, p2y = cy + st.yOffset - 35 + Math.cos(time) * 20;
        const p3x = w, p3y = cy + st.yOffset + Math.sin(time * 0.8) * 15;

        const sparkX = (1 - t) * (1 - t) * p1x + 2 * (1 - t) * t * p2x + t * t * p3x;
        const sparkY = (1 - t) * (1 - t) * p1y + 2 * (1 - t) * t * p2y + t * t * p3y;

        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00AEEF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Interconnected Floating Nodes & Network Web
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        // Draw connections between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p2.x - p.x, p2.y - p.y);
          if (dist < 75) {
            const lineAlpha = (1 - dist / 75) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(22, 199, 243, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Render Particle Point
        const currentAlpha = p.alpha * (Math.sin(time * 2 + p.phase) * 0.3 + 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`;
        ctx.fill();
      }

      // 4. Central Highlighted Focal Node (The Glowing ACM Connection Point)
      ctx.beginPath();
      ctx.arc(cx, cy, 6 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = '#16C7F3';
      ctx.shadowColor = '#00AEEF';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Outer pulse ring around focal core
      ctx.beginPath();
      ctx.arc(cx, cy, (12 + Math.sin(time * 3) * 6), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 174, 239, ${0.4 * (1 - Math.sin(time * 3) * 0.3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      mediaQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[540px] aspect-[16/10] mx-auto flex items-center justify-center select-none overflow-hidden rounded-2xl group py-2">
      {/* Volumetric background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/10 via-[#07152D]/30 to-transparent rounded-2xl blur-xl pointer-events-none" />

      {/* 60fps Canvas Animation */}
      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />

      {/* Minimal Integrated Label */}
      <div className="absolute bottom-[6%] left-[6%] z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#07152D]/80 backdrop-blur-md border border-[#00AEEF]/30 text-white shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#16C7F3] animate-pulse shadow-[0_0_8px_#00AEEF]" />
        <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-200 uppercase">
          ACM GLOBAL NETWORK
        </span>
      </div>
    </div>
  );
}
