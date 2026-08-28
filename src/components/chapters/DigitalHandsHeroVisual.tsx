'use client';

import React from 'react';
import Image from 'next/image';

export default function DigitalHandsHeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] flex items-center justify-center select-none overflow-hidden group py-4 lg:py-0">
      
      {/* 1. Volumetric Blue Atmospheric Glow behind Fingertips Connection Point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] lg:w-[480px] h-[300px] sm:h-[420px] lg:h-[480px] bg-[#00AEEF]/22 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
      
      {/* Secondary Soft Cyan Radial Highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[240px] h-[180px] sm:h-[240px] bg-[#16C7F3]/18 rounded-full blur-[80px] pointer-events-none" />

      {/* 2. Main Digital Hands Image Container (Exact User Reference Image) */}
      <div className="relative z-10 w-full max-w-[540px] lg:max-w-[620px] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/60 transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Soft Edge Blending Mask & Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B1A]/40 via-transparent to-[#050B1A]/30 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B1A]/30 via-transparent to-[#050B1A]/30 z-10 pointer-events-none" />

        {/* The Exact Reference Digital Hands Image */}
        <Image
          src="/images/digital_hands_hero.png"
          alt="ACM Student Network Connection - Digital Hands"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-contain object-center scale-[1.02] transition-all duration-700 group-hover:scale-[1.04]"
        />

        {/* Subtle Interactive Fingertip Light Shimmer Effect */}
        <div className="absolute top-1/2 left-[50.5%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-300/30 blur-md animate-ping-slow pointer-events-none z-20" />
      </div>

      <style jsx global>{`
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(1.04);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        @keyframes pingSlow {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
