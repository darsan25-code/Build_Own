'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Clock,
  Calendar,
  Users,
  Shield,
  Layers,
  Award,
  ChevronRight,
  Zap,
  CheckCircle2,
  Terminal,
  AlertCircle,
  FileCode,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchContest();
  }, [slug]);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contests/${slug}`);
      const data = await res.json();
      if (data.success) {
        setContest(data.contest);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      setMsg('');
      const res = await fetch(`/api/contests/${slug}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setContest((prev: any) => ({ ...prev, isRegistered: true }));
        setMsg('Successfully registered! You can now enter the Coding Arena.');
      } else {
        setMsg(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setMsg(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading contest details...</span>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white">Contest Not Found</h2>
        <Link href="/contests" className="acm-back-btn-dark mt-4">
          <ArrowLeft className="acm-back-icon" />
          <span>Back to Contests Directory</span>
        </Link>
      </div>
    );
  }

  const isLive = contest.status === 'LIVE';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* Institutional Brand Header */}
      <div className="bg-gradient-to-r from-[#0B1E3D] via-[#003B6E] to-[#005596] border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 px-2 py-0.5 bg-white rounded-lg flex items-center shadow-sm">
                <img src="/images/acm_official_logo.svg" alt="ACM Official Logo" className="h-6 w-auto object-contain" />
              </div>
              <div className="w-px h-6 bg-white/20" />
              <img src="/images/veltech_seal.svg" alt="Vel Tech" className="w-8 h-8 rounded-full bg-white/10 p-0.5" />
              <div>
                <div className="text-white font-extrabold text-xs leading-tight">Vel Tech High Tech</div>
                <div className="text-blue-200 text-[10px] leading-tight">ACM Student Chapter — Contest Portal</div>
              </div>
            </div>
            <Link href="/contests" className="acm-back-btn-dark">
              <ArrowLeft className="acm-back-icon" />
              <span>All Contests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contest Banner & Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE NOW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-500/40 text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    UPCOMING CONTEST
                  </span>
                )}
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  {contest.durationMinutes} Minutes Duration
                </span>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {contest.prizePool}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {contest.title}
              </h1>

              <p className="text-slate-300 text-base leading-relaxed">
                {contest.description}
              </p>
            </div>

            {/* Quick Registration & Enter Arena Card */}
            <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400 pb-3 border-b border-slate-800">
                <span>Contest Fee</span>
                <span className="text-emerald-400 font-bold text-sm">FREE (ACM Sponsored)</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Coders:</span>
                  <span className="font-semibold text-white">{contest._count?.participants || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Problems in Round:</span>
                  <span className="font-semibold text-white">{contest.problems?.length || 0} Challenges</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Score:</span>
                  <span className="font-semibold text-white">
                    {contest.problems?.reduce((acc: number, p: any) => acc + p.score, 0) || 0} Points
                  </span>
                </div>
              </div>

              {msg && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                  {msg}
                </div>
              )}

              {isLive ? (
                contest.isRegistered ? (
                  <Link
                    href={`/contests/${contest.slug}/arena`}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all duration-150 active:scale-[0.98] shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-emerald-200" />
                    Enter Coding Arena Now
                  </Link>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    {registering ? 'Registering...' : 'Register to Participate'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )
              ) : contest.isRegistered ? (
                <div className="w-full py-3 px-4 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-xs text-center border border-emerald-500/30 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Registered (Awaiting Start)
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {registering ? 'Registering...' : 'Register for Contest'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <Link
                href={`/contests/${contest.slug}/leaderboard`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                View Live Standings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Problem Set Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Problem List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Contest Problem Set ({contest.problems?.length || 0})
            </h2>
            <span className="text-xs text-slate-400">Languages: Python, JS, C++, Java</span>
          </div>

          <div className="space-y-3">
            {contest.problems?.map((prob: any, idx: number) => {
              const diffColors: Record<string, string> = {
                EASY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                HARD: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
              };

              return (
                <div
                  key={prob.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                      Q{prob.orderIndex || idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                        {prob.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${diffColors[prob.difficulty] || diffColors.MEDIUM}`}>
                          {prob.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-medium">{prob.score} Points</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{prob.tags}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/contests/${contest.slug}/arena?problem=${prob.slug}`}
                    className="py-2 px-4 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    Solve Challenge
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Rules & Guidelines */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Contest Rules & Code Guidelines
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-2">
              {contest.rules || 'Standard ACM ICPC collegiate contest guidelines apply.'}
            </div>
          </div>
        </div>

        {/* Right Column: Information & Timeline */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Contest Timeline
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Start Time</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">
                  {new Date(contest.startTime).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">End Time</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">
                  {new Date(contest.endTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Prizes & Recognition
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Top rankers win cash awards, digital verified ACM Certificates of Merit, and fast-track interviews for competitive programming delegations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
