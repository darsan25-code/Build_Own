import Link from 'next/link';
import { 
  Sparkles, Calendar, Globe, Users, ArrowRight, Search, BookOpen, 
  Award, Briefcase, ChevronRight, CheckCircle2, TrendingUp, Building, 
  MapPin, Clock, MessageSquare, Zap, Trophy, ShieldCheck, Flame, Compass, Code
} from 'lucide-react';
import { db } from '@/server/db/client';
import ConnectedNodesBackground from '@/components/home/ConnectedNodesBackground';
import HomeCinematicVisual from '@/components/home/HomeCinematicVisual';

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
    <div className="space-y-12 sm:space-y-16 pb-16 w-full animate-fade-in bg-slate-50">
      
      {/* =========================================================================
          1. HOME HERO SECTION (DARK NAVY CONTAINER)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] text-white pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-16 border-b border-[#082B52] shadow-2xl">
        
        {/* Connected Nodes Background Layer */}
        <ConnectedNodesBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* LEFT COLUMN: Editorial Typography & Action CTAs */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              
              {/* Vel Tech × ACM Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00AEEF]/10 backdrop-blur-md border border-[#00AEEF]/30 text-xs font-mono font-bold text-[#16C7F3] uppercase tracking-wider shadow-sm max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate">VEL TECH HIGH TECH × ACM PLATFORM</span>
              </div>

              {/* Editorial Display Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
                Discover. Connect. <br />
                <span className="text-[#00AEEF]">Participate.</span> Build.
              </h1>

              {/* Concise Description */}
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                The unified platform for students to discover flagship technical events, competitive coding rounds, verified ACM chapters, and career-defining computing opportunities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/events"
                  className="min-h-[48px] px-5 sm:px-6 py-3 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Explore Events</span>
                </Link>
                <Link
                  href="/chapters"
                  className="min-h-[48px] px-5 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-md hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4 text-[#16C7F3] flex-shrink-0" />
                  <span>Find a Chapter</span>
                </Link>
                <Link
                  href="/signup"
                  className="min-h-[48px] px-5 sm:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Join Community</span>
                </Link>
              </div>

              {/* Trending Filter Tags */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                <span className="text-slate-400 font-semibold mr-1">Trending:</span>
                {['Hackathons', 'GenAI Talks', 'Competitive Programming', 'Research Summits'].map((tag) => (
                  <Link
                    key={tag}
                    href="/events"
                    className="px-3 py-1 rounded-lg bg-[#07152D] hover:bg-[#082B52] border border-[#082B52] hover:border-[#00AEEF]/40 transition-all text-slate-200 hover:text-white font-mono text-[11px]"
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
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 p-3 bg-[#07152D]/90 backdrop-blur-md rounded-xl border border-white/20 text-white flex items-center justify-between gap-2 shadow-xl">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src="/images/veltech_seal.png" alt="Vel Tech Emblem" className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-full bg-white p-0.5 flex-shrink-0 shadow-sm" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold leading-tight truncate text-white">Vel Tech High Tech</div>
                          <div className="text-[10px] sm:text-xs text-slate-300 leading-tight truncate">Dr.Rangarajan Dr.Sakunthala Engg College</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0">
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
          2. IMPACT METRICS STRIP (CLEAN HIGH CONTRAST CARD ON LIGHT BG)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.chapters}</div>
            <div className="text-xs text-[#475569] font-semibold mt-1">Active ACM Chapters</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.institutions}</div>
            <div className="text-xs text-[#475569] font-semibold mt-1">Partner Universities</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{stats.students}+</div>
            <div className="text-xs text-[#475569] font-semibold mt-1">Verified Students</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#008FD5] tracking-tight">{stats.events}</div>
            <div className="text-xs text-[#475569] font-semibold mt-1">Events &amp; Workshops</div>
          </div>

          <div className="pt-2 md:pt-0 col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.registrations}+</div>
            <div className="text-xs text-[#475569] font-semibold mt-1">Cross-College Registrations</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRENDING TECHNICAL EVENTS (LIGHT SECTION - DARK NAVY #0F172A TYPOGRAPHY)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-mono font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#EA580C] flex-shrink-0" />
              <span>OPEN FOR REGISTRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight pt-1">
              Trending Technical Events
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] max-w-2xl font-normal leading-relaxed">
              Students from any institution can register for public events without mandatory host chapter membership.
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs sm:text-sm font-extrabold text-[#008FD5] hover:text-[#0069A5] flex items-center gap-1.5 group self-start sm:self-auto min-h-[44px]"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#008FD5]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {events.map((evt) => {
            const dateObj = new Date(evt.startTime);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.getDate();
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={evt.id}
                className="group bg-white border border-slate-200 hover:border-[#008FD5]/50 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div className="space-y-3.5">
                  {/* Event Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 bg-sky-50 text-[#008FD5] text-xs font-mono font-bold rounded-lg border border-sky-200">
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {evt.format}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#008FD5] transition-colors">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#475569] mt-2 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-1">{evt.chapter.institution?.name || evt.chapter.name}</span>
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#008FD5] flex-shrink-0" />
                      <span className="font-bold text-[#0F172A]">{monthStr} {dayStr}</span>
                      <span className="text-slate-300">•</span>
                      <span>{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#008FD5] flex-shrink-0" />
                      <span className="line-clamp-1 text-[#64748B]">{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                      <span>Capacity: <strong className="text-[#0F172A] font-bold">{evt.currentRegistrations}/{evt.maxCapacity}</strong></span>
                      {evt.certificateEligible && (
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Cert
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F172A]">{evt.isPaid ? `$${evt.price}` : 'Free Access'}</span>
                  <Link
                    href={`/events/${evt.slug}`}
                    className="px-4 py-2.5 bg-[#008FD5] hover:bg-[#0074B0] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all min-h-[44px] flex items-center justify-center"
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
          4. EXPLORE CHAPTERS (DARK FEATURE BLOCK CONTAINER WITH FULL WRAPPER)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#050B1A] via-[#07152D] to-[#082B52] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6 border border-[#082B52] shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#16C7F3] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>ACM Global Chapter Network</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Explore ACM Student Chapters
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Connect with chapter officers, attend local and global workshops, and collaborate across universities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/chapters"
                  className="px-6 py-3 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all min-h-[44px] flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Find a Chapter</span>
                </Link>
                <Link
                  href="/chapters"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all min-h-[44px] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#16C7F3] flex-shrink-0" />
                  <span>Start a Chapter</span>
                </Link>
              </div>
            </div>

            {/* Right Side Visual: Futuristic Cinematic Network Flow */}
            <div className="lg:col-span-5 relative flex items-center justify-center w-full">
              <HomeCinematicVisual />
            </div>
          </div>

          {/* Cards Grid inside Feature Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10 items-stretch">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="group relative bg-[#07152D]/90 backdrop-blur-md border border-[#082B52] hover:border-[#00AEEF]/50 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md flex flex-col justify-between overflow-hidden h-full"
              >
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#00AEEF]">
                    <span className="font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 text-[#16C7F3]">{ch.code}</span>
                    <span className="text-slate-300 font-sans text-xs font-semibold">{ch.institution?.country || 'Global'}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-white group-hover:text-[#00AEEF] transition-colors line-clamp-1">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal h-9">
                      {ch.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/chapters/${ch.code}`}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-[#050B1A]/90 group-hover:bg-[#082B52] border-t border-[#082B52] transition-all text-xs font-extrabold text-[#00AEEF] group-hover:text-white min-h-[44px]"
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
          5. GROWTH TRACKS SECTION (LIGHT SECTION - DARK NAVY #0F172A TYPOGRAPHY)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1.5 border-b border-slate-200 pb-3">
          <span className="text-xs font-mono font-bold text-[#008FD5] uppercase tracking-widest">GROWTH TRACKS</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">Opportunities for Every Student</h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl font-normal">Empowering student developers, researchers, and tech leaders worldwide.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 hover:border-purple-300 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Hackathons</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">Multi-college programming contests &amp; arenas.</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 hover:border-sky-300 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#008FD5] flex items-center justify-center border border-sky-200">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Workshops</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">GenAI, Cloud &amp; DevOps masterclasses.</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Research</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">Publications &amp; ACM Digital Library.</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Careers</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">Alumni network, internships &amp; mentorship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
