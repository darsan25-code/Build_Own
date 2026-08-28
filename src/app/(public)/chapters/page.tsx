import Link from 'next/link';
import { 
  Globe, Users, Building, Search, PlusCircle, ArrowRight, MapPin, 
  Sparkles, Trophy, Zap, BookOpen, Award, Briefcase, Compass
} from 'lucide-react';
import { db } from '@/server/db/client';
import DigitalHandsHeroVisual from '@/components/chapters/DigitalHandsHeroVisual';

export default async function ChaptersPage() {
  const chapters = await db.chapter.findMany({
    where: { status: 'APPROVED' },
    include: {
      institution: true,
      _count: { select: { memberships: true, officers: true, events: true } },
    },
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* =========================================================================
          1. CHAPTERS HERO SECTION — Cinematic Digital Connection Ecosystem
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-[#082B52] my-3 min-h-[560px] sm:min-h-[600px] lg:min-h-[640px] flex items-center">
        
        {/* Background Radial Volumetric Light Glows */}
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[450px] sm:w-[580px] h-[450px] sm:h-[580px] bg-[#00AEEF]/16 rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-blue-600/12 rounded-full blur-[140px] pointer-events-none select-none" />
        
        {/* Ambient Grid Overlay */}
        <div className="absolute inset-0 acm-pattern-grid opacity-15 pointer-events-none select-none" />

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side Content (50% on Desktop) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#00AEEF]/10 text-[#16C7F3] border border-[#00AEEF]/30 backdrop-blur-md uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>ACM GLOBAL CHAPTER NETWORK</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Explore ACM <br />
              <span className="text-[#00AEEF]">Student Chapters</span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Connect with chapter officers, attend local and global workshops, and collaborate across universities.
            </p>
            
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#find-chapter"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 h-[50px]"
              >
                <Compass className="w-4 h-4 text-white flex-shrink-0" />
                <span>Find a Chapter</span>
              </a>
              <a
                href="#start-chapter"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 h-[50px]"
              >
                <Sparkles className="w-4 h-4 text-[#16C7F3] flex-shrink-0" />
                <span>Start a Chapter</span>
              </a>
            </div>
          </div>

          {/* Right Side Visual (50% on Desktop): The Exact Uploaded Digital Hands Connection Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
            <DigitalHandsHeroVisual />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE GLOBAL NETWORK (STATISTICS TRANSITION STRIP)
         ========================================================================= */}
      <section className="w-full space-y-3 pt-2">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-[#00AEEF] uppercase tracking-widest">THE GLOBAL NETWORK</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">One Community. Countless Possibilities.</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
          
          <div className="bg-[#07152D] backdrop-blur-md border border-[#082B52] rounded-2xl p-4 shadow-lg flex items-center gap-3.5 hover:border-[#00AEEF]/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#00AEEF]/10 text-[#16C7F3] border border-[#00AEEF]/20 flex items-center justify-center font-bold flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">1,000+</div>
              <div className="text-[11px] text-slate-300 font-medium">Student Chapters</div>
            </div>
          </div>

          <div className="bg-[#07152D] backdrop-blur-md border border-[#082B52] rounded-2xl p-4 shadow-lg flex items-center gap-3.5 hover:border-[#00AEEF]/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#00AEEF]/10 text-[#16C7F3] border border-[#00AEEF]/20 flex items-center justify-center font-bold flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">100+</div>
              <div className="text-[11px] text-slate-300 font-medium">Countries &amp; Regions</div>
            </div>
          </div>

          <div className="bg-[#07152D] backdrop-blur-md border border-[#082B52] rounded-2xl p-4 shadow-lg flex items-center gap-3.5 hover:border-[#00AEEF]/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">50K+</div>
              <div className="text-[11px] text-slate-300 font-medium">Student Members</div>
            </div>
          </div>

          <div className="bg-[#07152D] backdrop-blur-md border border-[#082B52] rounded-2xl p-4 shadow-lg flex items-center gap-3.5 hover:border-[#00AEEF]/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold flex-shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">4</div>
              <div className="text-[11px] text-slate-300 font-medium">Global Communities</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. FIND A CHAPTER (PRODUCT SEARCH INTERFACE)
         ========================================================================= */}
      <section id="find-chapter" className="w-full space-y-5">
        <div className="bg-[#07152D] backdrop-blur-xl border border-[#082B52] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#00AEEF] uppercase tracking-widest">CHAPTER DIRECTORY</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">Find Your Chapter</h2>
              <p className="text-xs sm:text-sm text-slate-300">Discover ACM communities near you and across the world.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
              {chapters.length} Chapters Active
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-1">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search institution, chapter code or location..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-[#082B52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] text-white placeholder-slate-400 font-medium bg-[#050B1A] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <select className="px-4 py-3 text-xs sm:text-sm border border-[#082B52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-[#050B1A] font-semibold text-slate-200 cursor-pointer">
              <option>All Countries</option>
              <option>India</option>
              <option>United States</option>
              <option>Global</option>
            </select>

            <select className="px-4 py-3 text-xs sm:text-sm border border-[#082B52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-[#050B1A] font-semibold text-slate-200 cursor-pointer">
              <option>All Chapter Types</option>
              <option>Student Chapter</option>
              <option>Professional Chapter</option>
            </select>

            <button className="px-6 py-3 bg-[#00AEEF] hover:bg-[#0096ce] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 min-h-[44px]">
              <Search className="w-4 h-4 text-white" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. FEATURED CHAPTERS DIRECTORY CARDS
           ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white tracking-tight">Featured Chapters</h3>
            <span className="text-xs text-slate-300 font-medium">Explore active chapter hubs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="group relative bg-[#07152D]/90 backdrop-blur-md border border-[#082B52] hover:border-[#00AEEF]/50 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-2xl flex flex-col justify-between overflow-hidden h-full"
              >
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-2.5 py-0.5 bg-[#00AEEF]/10 text-[#16C7F3] rounded-lg border border-[#00AEEF]/20 font-mono text-xs font-extrabold">
                      {ch.code}
                    </span>
                    <div className="flex items-center gap-1 text-slate-300 font-medium text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ch.institution?.country || 'Global'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#00AEEF] transition-colors line-clamp-1">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal h-12">
                      {ch.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium pt-3 border-t border-[#082B52]">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-white">{ch._count?.memberships || 0}</strong> Members
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-white">{ch._count?.events || 0}</strong> Events
                    </span>
                  </div>

                  <Link
                    href={`/chapters/${ch.code}`}
                    className="w-full py-3 px-4 bg-[#050B1A]/90 group-hover:bg-[#082B52] text-[#00AEEF] group-hover:text-white border border-[#082B52] rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98] select-none text-center min-h-[44px]"
                  >
                    <span>View Chapter</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. GROW WITH ACM (EDITORIAL ASYMMETRIC LAYOUT)
         ========================================================================= */}
      <section className="w-full space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#008FD5] uppercase tracking-widest">GROW WITH ACM</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">More Than a Chapter.</h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl font-normal opacity-100">Empowering student developers, researchers, and tech leaders worldwide.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] border border-[#082B52] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-widest">FLAGSHIP TRACK</span>
              <h3 className="text-xl font-extrabold text-white leading-tight">Technical Events &amp; Hackathons</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compete in multi-college coding arenas, build production-grade projects, and get recognized by top tech employers.
              </p>
            </div>

            <div className="pt-3 border-t border-[#082B52] flex items-center justify-between text-xs font-bold text-purple-300 relative z-10">
              <span>EXPLORE CONTESTS</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#00AEEF] flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Workshops</h3>
                <p className="text-xs text-slate-300 leading-relaxed">GenAI, Cloud &amp; DevOps masterclasses.</p>
              </div>
              <div className="pt-1 text-xs font-bold text-[#00AEEF] flex items-center gap-1">
                <span>LEARN MORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Research</h3>
                <p className="text-xs text-slate-300 leading-relaxed">ACM Digital Library &amp; paper archives.</p>
              </div>
              <div className="pt-1 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>EXPLORE PAPERS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Leadership</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Chapter officer roles &amp; management.</p>
              </div>
              <div className="pt-1 text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>BECOME OFFICER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Career Opportunities</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Alumni network &amp; internships.</p>
              </div>
              <div className="pt-1 text-xs font-bold text-indigo-400 flex items-center gap-1">
                <span>CONNECT ALUMNI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FINAL CALL TO ACTION ("BUILD THE NEXT CHAPTER.")
         ========================================================================= */}
      <section id="start-chapter" className="w-full">
        <div className="bg-gradient-to-r from-[#050B1A] via-[#07152D] to-[#082B52] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden border border-[#082B52]">
          <div className="max-w-2xl mx-auto space-y-2.5 relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Build the Next Chapter.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bring ACM to your campus and create a community where students learn, collaborate and lead.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 relative z-10">
            <a
              href="https://www.acm.org/chapters/start-a-chapter"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all min-h-[44px] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Start a Chapter</span>
            </a>
            <a
              href="#find-chapter"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all min-h-[44px] flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4 text-[#16C7F3]" />
              <span>Explore the Network</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
