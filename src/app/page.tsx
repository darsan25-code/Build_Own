import Link from 'next/link';
import { 
  Sparkles, Calendar, Globe, Users, ArrowRight, Search, BookOpen, 
  Award, Briefcase, ChevronRight, CheckCircle2, TrendingUp, Building, 
  MapPin, Clock, MessageSquare, Zap, Trophy, ShieldCheck, Flame
} from 'lucide-react';
import { db } from '@/server/db/client';

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
    <div className="space-y-12 pb-16">
      
      {/* =========================================================================
          1. HERO SECTION: Multi-Institution Platform Value Proposition
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1E3D] via-[#003B6E] to-[#005596] text-white pt-10 pb-16 sm:pt-14 sm:pb-20 shadow-lg">
        {/* Subtle Ambient Background Grid Pattern */}
        <div className="absolute inset-0 acm-pattern-grid opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* LEFT COLUMN: Main Heading, Badges, CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Vel Tech High Tech × ACM — Global Computing Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Discover. Connect. <br />
                <span className="text-[#00A3E0]">Participate.</span> Build.
              </h1>

              <p className="text-sm sm:text-base lg:text-base xl:text-lg text-blue-100 font-normal leading-relaxed max-w-xl">
                The unified platform for students to discover flagship technical events, competitive coding rounds, verified ACM chapters, and career-defining computing opportunities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/events"
                  className="px-6 py-3 bg-white text-[#005596] font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#005596]" />
                  <span>Explore Events</span>
                </Link>
                <Link
                  href="/chapters"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/30 backdrop-blur-sm active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-[#00A3E0]" />
                  <span>Find a Chapter</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-[#00A3E0] hover:bg-[#008cc0] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all"
                >
                  Join Community
                </Link>
              </div>

              {/* Quick Opportunity Filter Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-blue-200">
                <span className="text-white/70 font-semibold">Trending:</span>
                {['Hackathons', 'GenAI Talks', 'Competitive Programming', 'Research Summits'].map((tag) => (
                  <Link
                    key={tag}
                    href="/events"
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-white/90 hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Premium High-Resolution Campus Photo Showcase & Connectivity Overlay */}
            <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex items-center justify-center overflow-hidden rounded-3xl p-2 sm:p-4">
              {/* Subtle Lightweight Connectivity Network & Grid Graphic (SVG) */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="hero-dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#00A3E0" opacity="0.35" />
                  </pattern>
                  <rect width="500" height="400" fill="url(#hero-dot-grid)" />
                  <path d="M 30 60 Q 150 20 280 120 T 470 160" stroke="#00A3E0" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <path d="M 50 340 Q 200 380 340 260 T 480 60" stroke="#005596" strokeWidth="1.2" opacity="0.6" />
                  <circle cx="30" cy="60" r="4" fill="#00A3E0" />
                  <circle cx="280" cy="120" r="5" fill="#38BDF8" />
                  <circle cx="470" cy="160" r="4" fill="#60A5FA" />
                  <circle cx="200" cy="380" r="3.5" fill="#00A3E0" />
                  <circle cx="340" cy="260" r="4.5" fill="#93C5FD" />
                </svg>
              </div>

              {/* Campus Showcase Card — High-Resolution 1024x682 Asset with Premium Frame */}
              <div className="relative group w-full max-w-xl lg:max-w-2xl mx-auto">
                {/* Ambient Subtle Accent Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#00A3E0]/20 to-[#005596]/30 blur-xl opacity-60 group-hover:opacity-85 transition-opacity" />
                
                {/* Polished Frame Wrapper with Subtle Inner Highlight */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-b from-white/15 to-white/5 p-1.5 sm:p-2 transition-transform duration-300 group-hover:scale-[1.005]">
                  <div className="relative w-full aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src="/images/veltech_campus.jpg"
                      alt="Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College Campus"
                      width={1024}
                      height={682}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                    />
                    {/* Subtle bottom gradient to highlight badge without obscuring building text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E3D]/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Badge on Image */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3 sm:p-3.5 bg-[#0B1E3D]/85 backdrop-blur-sm rounded-xl border border-white/20 text-white flex items-center justify-between gap-3 shadow-xl">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <img src="/images/veltech_seal.png" alt="Vel Tech Emblem" className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full bg-white p-0.5 flex-shrink-0 shadow-sm" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold leading-tight truncate">Vel Tech High Tech</div>
                          <div className="text-[10px] sm:text-xs text-blue-100 leading-tight truncate">Dr.Rangarajan Dr.Sakunthala Engg College</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
          2. PLATFORM IMPACT: Live Network Metrics
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xl grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#005596] tracking-tight">{stats.chapters}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Active ACM Chapters</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#005596] tracking-tight">{stats.institutions}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Partner Universities</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#005596] tracking-tight">{stats.students}+</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Verified Students</div>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#005596] tracking-tight">{stats.events}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Events & Workshops</div>
          </div>

          <div className="pt-2 md:pt-0 col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">{stats.registrations}+</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Cross-College Registrations</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRENDING / FEATURED EVENTS: Multi-College Open Participation
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#005596] uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-500" /> Open for Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Trending Technical Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Students from any institution can register for public events without mandatory host chapter membership.
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-[#005596] hover:text-[#003B6E] flex items-center gap-1.5 group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const dateObj = new Date(evt.startTime);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.getDate();
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={evt.id}
                className="acm-card-hover p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar with Badge & Host Info */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-[#005596] text-[11px] font-extrabold rounded-lg border border-blue-100">
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {evt.format}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#005596] transition-colors">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{evt.chapter.institution?.name || evt.chapter.name}</span>
                    </div>
                  </div>

                  {/* Date, Location & Capacity Details */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#005596]" />
                      <span className="font-semibold text-slate-800">{monthStr} {dayStr}</span>
                      <span className="text-slate-400">•</span>
                      <span>{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#005596]" />
                      <span className="line-clamp-1">{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Capacity: <strong className="text-slate-800">{evt.currentRegistrations}/{evt.maxCapacity}</strong></span>
                      {evt.certificateEligible && (
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified Cert
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{evt.isPaid ? `$${evt.price}` : 'Free Access'}</span>
                  <Link
                    href={`/events/${evt.slug}`}
                    className="px-4 py-2 bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    View & Register
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. EXPLORE CHAPTERS: Multi-University Directory
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-[#0B1E3D] to-[#003B6E] text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <span className="text-xs font-extrabold text-[#00A3E0] uppercase tracking-wider">Chapter Network</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Explore ACM Student Chapters</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect with chapter officers, attend local and global workshops, and collaborate across universities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 hover:border-white/30 transition-all shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#00A3E0]">
                    <span className="font-bold">{ch.code}</span>
                    <span className="text-slate-300 font-sans">{ch.institution.country}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-white line-clamp-1">{ch.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{ch.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{ch._count.memberships} Members</span>
                  <Link
                    href={`/chapters/${ch.code}`}
                    className="px-3.5 py-1.5 bg-white text-[#005596] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    View Chapter
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2 relative z-10">
            <Link
              href="/chapters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A3E0] hover:bg-[#008cc0] text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Browse All {stats.chapters} Active Chapters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. OPPORTUNITIES: Hackathons, Masterclasses, Research, Careers
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div>
          <span className="text-xs font-bold text-[#005596] uppercase tracking-wider">Growth Tracks</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">Opportunities for Every Student</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 acm-card-hover flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Hackathons</h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">Multi-college contests with prizes.</p>
            </div>
          </div>

          <div className="p-5 acm-card-hover flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center border border-blue-100">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Workshops</h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">GenAI, Cloud, DevOps masterclasses.</p>
            </div>
          </div>

          <div className="p-5 acm-card-hover flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Research</h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">Publications & ACM Digital Library.</p>
            </div>
          </div>

          <div className="p-5 acm-card-hover flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Careers</h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">Alumni, internships & mentorship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LEARNING HUB & PUBLICATIONS: Curated Resources
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">ACM Learning Hub & Research</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Curated skill paths and flagship peer-reviewed computing publications.</p>
          </div>
          <Link href="/resources" className="text-xs font-bold text-[#005596] hover:underline flex items-center gap-1">
            <span>Explore Resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {publications.map((pub) => (
            <div key={pub.id} className="p-5 acm-card-hover space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-[#005596] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {pub.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{pub.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{pub.abstract}</p>
              </div>

              <Link
                href="/publications"
                className="text-xs font-bold text-[#005596] hover:text-[#003B6E] flex items-center gap-1 pt-1"
              >
                <span>Read Publication</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. ANNOUNCEMENTS & NOTICES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50/60 border border-blue-100/80 rounded-2xl p-5 sm:p-7 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#005596] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Platform Announcements & Call for Papers</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">Live Updates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm space-y-2">
                <div className="text-[10px] font-extrabold text-amber-700 bg-amber-50 inline-block px-2.5 py-0.5 rounded-full border border-amber-100">
                  {ann.scope} BULLETIN
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. COMMUNITY TESTIMONIALS: Voices Across Universities
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Voices</h2>
          <span className="text-xs font-medium text-slate-400">— cross-college ACM community</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 acm-card space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Being able to register for hackathons and AI symposiums hosted by chapters in other states opened up international research collaborations for our team.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                S
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Sarah Jenkins</div>
                <div className="text-[11px] text-slate-500">MIT Student Chapter</div>
              </div>
            </div>
          </div>

          <div className="p-6 acm-card space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;The transaction-safe registration and verified certificate credentials made managing our regional coding contest effortless.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Alex Kumar</div>
                <div className="text-[11px] text-slate-500">XYZ College Student Member</div>
              </div>
            </div>
          </div>

          <div className="p-6 acm-card space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;The multi-institution platform gives our students immediate visibility into premier academic tech talks and global ACM career resources.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                R
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Robert Vance</div>
                <div className="text-[11px] text-slate-500">Faculty Coordinator</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#003B6E] via-[#005596] to-[#0072CE] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Join the Global ACM Computing Community
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Connect with fellow student innovators, organize flagship chapter activities, and earn recognized credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <Link
              href="/signup"
              className="px-6 py-3.5 bg-white text-[#005596] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-blue-50 active:scale-[0.98] transition-all"
            >
              Create Free Student Account
            </Link>
            <Link
              href="/chapters"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/30 backdrop-blur-sm active:scale-[0.98] transition-all"
            >
              Start or Join a Chapter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
