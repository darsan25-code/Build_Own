import Link from 'next/link';
import { Globe, Users, Building, Search, PlusCircle, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function ChaptersPage() {
  const chapters = await db.chapter.findMany({
    where: { status: 'APPROVED' },
    include: {
      institution: true,
      _count: { select: { memberships: true, officers: true, events: true } },
    },
  });

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 animate-fade-in w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO / TOP BLUE SECTION — GLOBAL COMPUTING NETWORK */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#004B87] via-[#002548] to-[#001224] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-blue-400/20 my-2">
        {/* Subtle Background Circuit Grid */}
        <div className="absolute inset-0 acm-pattern-grid opacity-10 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-sky-400/15 text-sky-200 border border-sky-300/30 backdrop-blur-md uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span>ACM Global Chapter Ecosystem</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
              ACM Student Chapters
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl font-normal">
              Local communities. Global impact. Join a chapter or start a new one at your institution.
            </p>
            
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                href="#find-chapter"
                className="px-6 py-3.5 bg-white text-[#005596] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                Find a Chapter
              </a>
              <a
                href="#start-chapter"
                className="px-6 py-3.5 border border-white/40 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer"
              >
                Start a Chapter
              </a>
            </div>
          </div>

          {/* Right Decorative Global Computing Network Graphic Column */}
          <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative min-h-[260px]">
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              
              {/* Floating Technical UI Badges */}
              <div className="absolute top-2 left-4 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-200 border border-sky-300/30 text-[10.5px] font-mono font-extrabold shadow-sm animate-bounce" style={{ animationDuration: '4s' }}>
                CS :: AI
              </div>
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-300/30 text-[10.5px] font-mono font-extrabold shadow-sm animate-bounce" style={{ animationDuration: '5s' }}>
                ACM :: 01
              </div>
              <div className="absolute bottom-4 left-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-300/30 text-[10.5px] font-mono font-extrabold shadow-sm animate-bounce" style={{ animationDuration: '4.5s' }}>
                DSA :: WEB
              </div>
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-300/30 text-[10.5px] font-mono font-extrabold shadow-sm animate-bounce" style={{ animationDuration: '5.5s' }}>
                1,000+ Nodes
              </div>

              {/* Glowing Concentric Orbits & Pulse Rings */}
              <div className="absolute inset-0 rounded-full border border-sky-400/20 animate-pulse" />
              <div className="absolute inset-6 rounded-full border border-dashed border-sky-300/30 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-12 rounded-full border border-sky-400/15" />

              {/* Layered SVG Computing Network Graph */}
              <svg className="w-full h-full text-sky-300/50" viewBox="0 0 200 200" fill="none">
                <line x1="100" y1="35" x2="45" y2="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="100" y1="35" x2="155" y2="85" stroke="currentColor" strokeWidth="1.5" />
                <line x1="45" y1="85" x2="65" y2="155" stroke="currentColor" strokeWidth="1.5" />
                <line x1="155" y1="85" x2="135" y2="155" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="65" y1="155" x2="135" y2="155" stroke="currentColor" strokeWidth="1.5" />
                <line x1="45" y1="85" x2="155" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="100" y1="35" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="65" y2="155" stroke="currentColor" strokeWidth="1" />
                <line x1="100" y1="100" x2="135" y2="155" stroke="currentColor" strokeWidth="1" />
                <line x1="100" y1="100" x2="45" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="100" y1="100" x2="155" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />

                <circle cx="100" cy="35" r="6" fill="#00A3E0" />
                <circle cx="45" cy="85" r="5" fill="#38BDF8" />
                <circle cx="155" cy="85" r="5" fill="#38BDF8" />
                <circle cx="100" cy="100" r="7" fill="#ffffff" />
                <circle cx="65" cy="155" r="5" fill="#38BDF8" />
                <circle cx="135" cy="155" r="5" fill="#38BDF8" />
                <circle cx="30" cy="120" r="3" fill="#00A3E0" />
                <circle cx="170" cy="120" r="3" fill="#00A3E0" />
              </svg>

              {/* Central Globe Core Emblem */}
              <div className="absolute w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-2xl flex flex-col items-center justify-center text-white space-y-0.5">
                <Globe className="w-8 h-8 text-sky-200 animate-pulse" />
                <span className="text-[9px] font-mono font-extrabold text-sky-200 tracking-wider">ACM CORE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTERS CARDS */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-extrabold text-slate-900">1,000+</div>
              <div className="text-xs text-slate-500 font-semibold">Chapters Worldwide</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">Student Chapters</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Build local community</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Building className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">Professional Chapters</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Connect with experts</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">SIG Groups</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Special interest topics</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIND A CHAPTER SEARCH SECTION */}
      <section id="find-chapter" className="w-full space-y-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider">
              Find a Chapter
            </h3>
            <span className="text-xs font-semibold text-[#005596]">{chapters.length} Chapters Active</span>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by institution, chapter code or location..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] text-slate-800 placeholder-slate-400 font-medium bg-slate-50/50 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <select className="px-4 py-3 text-xs sm:text-sm border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] bg-slate-50/50 focus:bg-white font-semibold text-slate-700 cursor-pointer">
              <option>All Chapter Types</option>
              <option>Student Chapter</option>
              <option>Professional Chapter</option>
            </select>

            <button className="px-6 py-3 bg-[#005596] hover:bg-[#003B6E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 min-h-[44px]">
              <Search className="w-4 h-4" />
              <span>Search Directory</span>
            </button>
          </div>
        </div>

        {/* 4. CHAPTER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group h-full"
            >
              {/* Card Top Metadata & Body */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="px-3 py-1 bg-blue-50 text-[#005596] rounded-lg border border-blue-100 font-mono text-xs font-extrabold">
                    {ch.code}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ch.institution.country}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-[#005596] transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mt-2 font-normal">
                    {ch.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom Stats & Full-Width Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong className="text-slate-900">{ch._count.memberships}</strong> Members
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <strong className="text-slate-900">{ch._count.events}</strong> Events
                  </span>
                </div>

                {/* FULL-WIDTH RECTANGULAR VIEW CHAPTER TOUCH BUTTON */}
                <Link
                  href={`/chapters/${ch.code}`}
                  className="w-full py-3 px-4 bg-blue-50 hover:bg-[#005596] text-[#005596] hover:text-white border border-blue-100/90 hover:border-[#005596] rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98] select-none text-center group/btn min-h-[44px]"
                >
                  <span>View Chapter</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
