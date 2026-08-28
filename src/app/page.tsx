import Link from 'next/link';
import { 
  Sparkles, Calendar, Globe, Users, ArrowRight, Search, BookOpen, 
  Award, Briefcase, ChevronRight, CheckCircle2, TrendingUp, Building, 
  MapPin, Clock, MessageSquare, Zap, Trophy, ShieldCheck, Flame, Compass, Code
} from 'lucide-react';
import { db } from '@/server/db/client';
import ConnectedNodesBackground from '@/components/home/ConnectedNodesBackground';

export default async function HomePage() {
  // Fetch real database records & platform aggregates
  const [events, chapters, publications, resources, announcements] = await Promise.all([
    db.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { startTime: 'asc' },
      take: 6,
      include: { chapter: { include: { institution: true } }, institution: true },
    }),
    db.chapter.findMany({
      where: { status: 'APPROVED' },
      include: {
        institution: true,
        _count: { select: { memberships: true, officers: true, events: true } },
      },
      take: 6,
    }),
    db.publication.findMany({ take: 4 }),
    db.resource.findMany({ take: 6 }),
    db.announcement.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
  ]);

  const stats = {
    institutions: await db.institution.count(),
    chapters: await db.chapter.count({ where: { status: 'APPROVED' } }),
    events: await db.event.count({ where: { status: 'PUBLISHED' } }),
    students: await db.user.count(),
    registrations: await db.eventRegistration.count(),
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 w-full animate-fade-in">
      
      {/* =========================================================================
          1. HOME HERO SECTION: Vel Tech High Tech × ACM Platform (Compact 620-680px)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] text-white pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-16 border-b border-[#082B52] shadow-2xl">
        
        {/* Connected Nodes Background Layer */}
        <ConnectedNodesBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* LEFT COLUMN: Editorial Typography & Single-Row CTAs */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              
              {/* Vel Tech × ACM Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00AEEF]/10 backdrop-blur-md border border-[#00AEEF]/30 text-[11px] font-mono font-bold text-[#16C7F3] uppercase tracking-widest shadow-inner max-w-full truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate">VEL TECH HIGH TECH × ACM — GLOBAL PLATFORM</span>
              </div>

              {/* Editorial Display Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
                Discover. Connect. <br />
                <span className="text-[#00AEEF]">Participate.</span> Build.
              </h1>

              {/* Concise Description (Max 2-3 lines) */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                The unified platform for students to discover flagship technical events, competitive coding rounds, verified ACM chapters, and career-defining computing opportunities.
              </p>

              {/* CTAs in One Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/events"
                  className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Explore Events</span>
                </Link>
                <Link
                  href="/chapters"
                  className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-[#16C7F3] flex-shrink-0" />
                  <span>Find a Chapter</span>
                </Link>
                <Link
                  href="/signup"
                  className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Join Community</span>
                </Link>
              </div>

              {/* Trending Filter Pills */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-300">
                <span className="text-slate-400 font-semibold mr-0.5">Trending:</span>
                {['Hackathons', 'GenAI Talks', 'Competitive Programming', 'Research Summits'].map((tag) => (
                  <Link
                    key={tag}
                    href="/events"
                    className="px-2.5 py-0.5 rounded-lg bg-[#07152D] hover:bg-[#082B52] border border-[#082B52] transition-all text-slate-200 hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Protected Campus Photo Showcase Card */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0 flex items-center justify-center rounded-3xl p-1">
              <div className="relative group w-full max-w-lg lg:max-w-xl mx-auto">
                <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-600/30 blur-lg opacity-60 group-hover:opacity-85 transition-opacity" />
                
                <div className="relative rounded-2xl overflow-hidden border border-[#082B52] shadow-2xl bg-[#050B1A]/90 p-1.5 transition-transform duration-300 group-hover:scale-[1.005]">
                  <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-[#050B1A]">
                    <img
                      src="/images/veltech_campus.jpg"
                      alt="Vel Tech High Tech Campus"
                      width={1024}
                      height={682}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B1A]/90 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Information Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 p-2.5 sm:p-3 bg-[#07152D]/90 backdrop-blur-md rounded-xl border border-white/20 text-white flex items-center justify-between gap-2 shadow-xl">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src="/images/veltech_seal.png" alt="Vel Tech Emblem" className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-full bg-white p-0.5 flex-shrink-0 shadow-sm" />
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-extrabold leading-tight truncate">Vel Tech High Tech</div>
                          <div className="text-[9.5px] sm:text-[10.5px] text-slate-300 leading-tight truncate">Dr.Rangarajan Dr.Sakunthala Engg College</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Official Campus
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. IMPACT METRICS STRIP (DEEP NAVY COMPACT CONTAINER 120-160px)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-[#07152D] backdrop-blur-xl border border-[#082B52] rounded-2xl p-4 sm:p-5 shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-3 text-center divide-y md:divide-y-0 md:divide-x divide-[#082B52]">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.chapters}</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Active ACM Chapters</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.institutions}</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Partner Universities</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.students}+</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Verified Students</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00AEEF] tracking-tight">{stats.events}</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Events &amp; Workshops</div>
          </div>

          <div className="pt-2 md:pt-0 col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.registrations}+</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Cross-College Registrations</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRENDING TECHNICAL EVENTS: Deep Navy Cards
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
              <Flame className="w-4 h-4 text-orange-400" /> OPEN FOR REGISTRATION
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Trending Technical Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl">
              Students from any institution can register for public events without mandatory host chapter membership.
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-[#00AEEF] hover:text-white flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt) => {
            const dateObj = new Date(evt.startTime);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.getDate();
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={evt.id}
                className="group bg-[#07152D]/90 backdrop-blur-md border border-[#082B52] hover:border-[#00AEEF]/50 rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Event Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-[#00AEEF]/10 text-[#16C7F3] text-[11px] font-mono font-bold rounded-lg border border-[#00AEEF]/20">
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {evt.format}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#00AEEF] transition-colors">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1.5 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{evt.chapter.institution?.name || evt.chapter.name}</span>
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="space-y-1.5 pt-2.5 border-t border-[#082B52] text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#00AEEF]" />
                      <span className="font-semibold text-white">{monthStr} {dayStr}</span>
                      <span className="text-slate-400">•</span>
                      <span>{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" />
                      <span className="line-clamp-1">{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                      <span>Capacity: <strong className="text-white">{evt.currentRegistrations}/{evt.maxCapacity}</strong></span>
                      {evt.certificateEligible && (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Cert
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-[#082B52] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">{evt.isPaid ? `$${evt.price}` : 'Free Access'}</span>
                  <Link
                    href={`/events/${evt.slug}`}
                    className="px-4 py-2.5 bg-[#00AEEF] hover:bg-[#0096ce] text-white text-xs font-extrabold rounded-xl shadow transition-all min-h-[44px] flex items-center justify-center"
                  >
                    View &amp; Register
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. EXPLORE CHAPTERS: Deep Navy Directory Preview
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-10 space-y-6 border border-[#082B52] shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#16C7F3] text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>ACM Global Chapter Network</span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Explore ACM Student Chapters
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Connect with chapter officers, attend local and global workshops, and collaborate across universities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/chapters"
                  className="px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all min-h-[44px] flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Find a Chapter</span>
                </Link>
                <Link
                  href="/chapters"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all min-h-[44px] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#16C7F3] flex-shrink-0" />
                  <span>Start a Chapter</span>
                </Link>
              </div>
            </div>

            {/* Network Ecosystem Core */}
            <div className="lg:col-span-5 relative flex items-center justify-center pointer-events-none opacity-90">
              <div className="relative w-56 sm:w-72 h-56 sm:h-72 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400/25 via-blue-600/20 to-indigo-950/40 border border-cyan-300/60 shadow-[0_0_50px_rgba(0,240,255,0.35)] flex flex-col items-center justify-center p-3 text-center backdrop-blur-md">
                  <Globe className="w-7 h-7 text-cyan-300 mb-1 animate-pulse" />
                  <span className="text-[11px] font-mono font-extrabold text-cyan-200">ACM NETWORK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 items-stretch">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="group relative bg-[#07152D]/90 backdrop-blur-md border border-[#082B52] hover:border-[#00AEEF]/50 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 sm:p-5 space-y-2.5 flex-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#00AEEF]">
                    <span className="font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{ch.code}</span>
                    <span className="text-slate-300 font-sans text-[11px] font-semibold">{ch.institution?.country || 'Global'}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-white group-hover:text-[#00AEEF] transition-colors line-clamp-1">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed h-9">
                      {ch.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/chapters/${ch.code}`}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3 bg-[#050B1A]/90 group-hover:bg-[#082B52] border-t border-[#082B52] transition-all text-xs font-extrabold text-[#00AEEF] group-hover:text-white min-h-[44px]"
                >
                  <span>{ch._count?.memberships || 0} Members</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span>View Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. GROWTH TRACKS SECTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#00AEEF] uppercase tracking-widest">GROWTH TRACKS</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Opportunities for Every Student</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Hackathons</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">Multi-college programming contests &amp; arenas.</p>
            </div>
          </div>

          <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 hover:border-blue-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#00AEEF] flex items-center justify-center border border-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Workshops</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">GenAI, Cloud &amp; DevOps masterclasses.</p>
            </div>
          </div>

          <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Research</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">Publications &amp; ACM Digital Library.</p>
            </div>
          </div>

          <div className="p-5 bg-[#07152D] border border-[#082B52] rounded-2xl space-y-2.5 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Careers</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">Alumni network, internships &amp; mentorship.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
