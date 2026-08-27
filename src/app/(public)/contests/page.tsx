'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  Trophy,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  Terminal,
  Shield,
} from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'UPCOMING' | 'LIVE' | 'ENDED';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  prizePool: string;
  chapter?: { id: string; name: string; code: string };
  _count?: { problems: number; participants: number; submissions: number };
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'ENDED'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, [filter]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contests?status=${filter}`);
      const data = await res.json();
      if (data.success) setContests(data.contests);
    } catch (err) {
      console.error('Failed to load contests', err);
    } finally {
      setLoading(false);
    }
  };

  const liveCount = contests.filter(c => c.status === 'LIVE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-10">

      {/* ── Institutional Header Banner ── */}
      <div className="bg-gradient-to-r from-[#0B1E3D] via-[#003B6E] to-[#005596] border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left: Dual Brand */}
            <div className="flex items-center gap-4">
              {/* ACM Logo */}
              <div className="flex items-center gap-2.5">
                <div className="h-9 sm:h-10 px-2.5 py-1 bg-white rounded-xl flex items-center shadow-sm flex-shrink-0">
                  <img
                    src="/images/acm_official_logo.svg"
                    alt="ACM Official Logo"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <div className="h-8 w-px bg-white/20" />
                {/* Vel Tech Seal */}
                <img
                  src="/images/veltech_seal.svg"
                  alt="Vel Tech"
                  className="w-10 h-10 object-contain rounded-full bg-white/10 p-0.5"
                />
                <div>
                  <div className="text-white font-extrabold text-sm leading-tight">Vel Tech High Tech</div>
                  <div className="text-blue-200 text-[11px] leading-tight">Dr.Rangarajan Dr.Sakunthala Engineering College</div>
                </div>
              </div>
            </div>

            {/* Right: Portal Title */}
            <div className="flex items-center gap-3">
              {liveCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {liveCount} Live
                </span>
              )}
              <div className="text-right">
                <div className="text-white font-extrabold text-sm">ACM Coding Contest Portal</div>
                <div className="text-blue-200 text-[11px]">Official Competitive Programming Arena</div>
              </div>
              <Shield className="w-7 h-7 text-blue-300 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

            {/* Title Block */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Vel Tech × ACM — Competitive Coding Arena
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Code. Compete. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                  Earn ACM Rank Badges
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Participate in LeetCode-style timed rounds, solve curated DSA challenges in our split-screen IDE, and win ACM-verified certificates &amp; prizes — organized by the Vel Tech High Tech ACM Student Chapter.
              </p>
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-3 gap-2.5 w-full lg:w-auto lg:min-w-64">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
                <span className="text-xl font-black text-white">₹35k+</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Prize Pool</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
                <span className="text-xl font-black text-emerald-400">Live IDE</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Multi-language</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
                <span className="text-xl font-black text-blue-400">ACM</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">

        {/* Filter Nav */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {(['ALL', 'LIVE', 'UPCOMING', 'ENDED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab === 'LIVE' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                )}
                {tab === 'ALL' ? 'All' : tab === 'LIVE' ? 'Live Now' : tab === 'UPCOMING' ? 'Upcoming' : 'Ended'}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-white font-semibold">{contests.length}</span> contest{contests.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Contest Cards */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading contests...</span>
          </div>
        ) : contests.length === 0 ? (
          <div className="py-16 text-center">
            <Code className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-400">No contests found</h3>
            <p className="text-slate-600 text-sm mt-1">Check back soon for new ACM coding rounds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {contests.map((contest) => {
              const isLive = contest.status === 'LIVE';
              const isUpcoming = contest.status === 'UPCOMING';
              const startDate = new Date(contest.startTime);

              return (
                <div
                  key={contest.id}
                  className={`group relative rounded-xl bg-gradient-to-b from-slate-900 to-slate-900/60 border ${
                    isLive
                      ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5 hover:border-emerald-400'
                      : 'border-slate-800 hover:border-slate-700'
                  } p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Subtle ACM Logo Watermark - top right corner, non-overlapping */}
                  <div className="absolute top-2.5 right-2.5 flex items-center opacity-30 pointer-events-none z-0">
                    <img
                      src="/images/acm_official_logo.svg"
                      alt="ACM Watermark"
                      className="h-4 sm:h-5 w-auto object-contain"
                    />
                  </div>

                  <div className="relative z-10 space-y-3">
                    {/* Status + Duration + Prize Badge Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE
                          </span>
                        ) : isUpcoming ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/40 text-blue-400 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            UPCOMING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700 flex-shrink-0">
                            ENDED
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-medium flex-shrink-0">{contest.durationMinutes} min</span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold max-w-full truncate shadow-sm">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{contest.prizePool || 'Certificate'}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {contest.title}
                    </h2>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {contest.description}
                    </p>

                    {/* Time Row */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>{startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Meta Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 text-center">
                        <div className="text-slate-500 text-[10px]">Problems</div>
                        <div className="font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-blue-400" />
                          {contest._count?.problems || 0}
                        </div>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 text-center">
                        <div className="text-slate-500 text-[10px]">Coders</div>
                        <div className="font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-emerald-400" />
                          {contest._count?.participants || 0}
                        </div>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 text-center">
                        <div className="text-slate-500 text-[10px]">Runs</div>
                        <div className="font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                          <Terminal className="w-3 h-3 text-amber-400" />
                          {contest._count?.submissions || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-800/80 relative z-10">
                    <Link
                      href={`/contests/${contest.slug}`}
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Details &amp; Rules
                    </Link>
                    {isLive ? (
                      <Link
                        href={`/contests/${contest.slug}/arena`}
                        className="flex-1 text-center py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-200" />
                        Enter Arena
                      </Link>
                    ) : (
                      <Link
                        href={`/contests/${contest.slug}`}
                        className="flex-1 text-center py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1"
                      >
                        Register
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ACM + Vel Tech Footer Strip ── */}
        <div className="mt-8 border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-7 px-2 py-0.5 bg-white rounded-lg flex items-center shadow-sm">
              <img src="/images/acm_official_logo.svg" alt="ACM" className="h-5 w-auto object-contain" />
            </div>
            <div className="w-px h-5 bg-slate-700" />
            <img src="/images/veltech_seal.svg" alt="Vel Tech" className="h-6 w-auto opacity-80" />
            <span className="text-slate-400 text-[11px]">Vel Tech High Tech ACM Student Chapter</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            All contests are organized by ACM Student Chapter, Avadi, Chennai · Certified Results
          </div>
        </div>
      </div>
    </div>
  );
}
