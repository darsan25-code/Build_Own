'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  Clock,
  ChevronLeft,
  ArrowLeft,
  RefreshCw,
  Zap,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

interface Standing {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  institutionName?: string;
  rank: number;
  score: number;
  totalPenaltyTime: number;
  problemScores: Record<string, { score: number; time?: number }>;
}

export default function ContestLeaderboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [slug]);

  const fetchLeaderboard = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/contests/${slug}/leaderboard`);
      const data = await res.json();
      if (data.success) {
        setContest(data.contest);
        setProblems(data.problems || []);
        setStandings(data.standings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Live Leaderboard...</span>
        </div>
      </div>
    );
  }

  const top3 = standings.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link
                href={`/contests/${slug}`}
                className="acm-back-btn-dark mb-3"
              >
                <ArrowLeft className="acm-back-icon" />
                <span>Back to Contest</span>
              </Link>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Live Standings: {contest?.title}
                </h1>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Official real-time rankings evaluated on testcase correctness and time penalty.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchLeaderboard}
                disabled={refreshing}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <Link
                href={`/contests/${slug}/arena`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-200" />
                Enter Arena
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Top 3 Podium Cards */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between order-2 md:order-1">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-400">#2</div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-slate-300 mb-4">
                    🥈
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Runner Up</span>
                  <h3 className="text-lg font-bold text-white mt-1">{top3[1].userName}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" />
                    {top3[1].institutionName || 'Independent'}
                  </span>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Score:</span>
                  <span className="text-xl font-black text-slate-200">{top3[1].score} pts</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold Winner) */}
            {top3[0] && (
              <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl shadow-amber-500/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between order-1 md:order-2 transform md:-translate-y-2">
                <div className="absolute top-0 right-0 p-4 opacity-15 font-black text-6xl text-amber-400">#1</div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center font-bold text-2xl text-amber-300 mb-4 shadow-lg shadow-amber-500/20">
                    👑
                  </div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tournament Leader</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">{top3[0].userName}</h3>
                  <span className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    {top3[0].institutionName || 'Independent'}
                  </span>
                </div>
                <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-between items-center">
                  <span className="text-xs text-amber-300 font-semibold">Champion Score:</span>
                  <span className="text-2xl font-black text-amber-400">{top3[0].score} pts</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between order-3">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-amber-700">#3</div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-950/40 border border-amber-700 flex items-center justify-center font-bold text-amber-600 mb-4">
                    🥉
                  </div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">2nd Runner Up</span>
                  <h3 className="text-lg font-bold text-white mt-1">{top3[2].userName}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" />
                    {top3[2].institutionName || 'Independent'}
                  </span>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Score:</span>
                  <span className="text-xl font-black text-slate-200">{top3[2].score} pts</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Standings Matrix Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Complete Contest Standings ({standings.length} Coders)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Participant & College</th>
                  <th className="py-3 px-4 text-center">Total Score</th>
                  {problems.map((p, idx) => (
                    <th key={p.id} className="py-3 px-3 text-center">
                      <span className="block font-bold text-white">Q{p.orderIndex || idx + 1}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{p.points} pts</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {standings.length === 0 ? (
                  <tr>
                    <td colSpan={3 + problems.length} className="py-12 text-center text-slate-500">
                      No submissions recorded yet for this contest.
                    </td>
                  </tr>
                ) : (
                  standings.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 text-center font-bold">
                        {row.rank === 1 ? (
                          <span className="inline-block w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 leading-6">
                            1
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="inline-block w-6 h-6 rounded-full bg-slate-700 text-slate-200 leading-6">
                            2
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="inline-block w-6 h-6 rounded-full bg-amber-900/40 text-amber-600 leading-6">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400">{row.rank}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{row.userName}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{row.institutionName || 'Independent'}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-black text-emerald-400">{row.score}</span>
                      </td>
                      {problems.map((prob) => {
                        const solvedData = row.problemScores[prob.slug] || row.problemScores[prob.id];
                        const isSolved = solvedData?.score === prob.points;
                        const partialScore = solvedData?.score || 0;
 
                        return (
                          <td key={prob.id} className="py-4 px-3 text-center">
                            {isSolved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                +{prob.points}
                              </span>
                            ) : partialScore > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-semibold text-[11px]">
                                +{partialScore}
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
