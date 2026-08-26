'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Plus,
  Layers,
  Users,
  Clock,
  Sparkles,
  ChevronRight,
  Code,
  Terminal,
} from 'lucide-react';

export default function AdminContestsPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contests');
      const data = await res.json();
      if (data.success) {
        setContests(data.contests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[#005596]" />
            Coding Contests & Problem Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create online algorithmic rounds, upload coding problems with test cases, and host Unstop-style contests.
          </p>
        </div>

        <Link
          href="/chapter-admin/contests/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005596] hover:bg-[#004070] text-white text-sm font-semibold transition-all shadow-md shadow-[#005596]/20"
        >
          <Plus className="w-4 h-4" />
          Create New Contest & Problems
        </Link>
      </div>

      {/* Contests List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading contests...</div>
      ) : contests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Code className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No contests created yet</h3>
          <p className="text-sm text-slate-500 mt-1">Get started by creating your first ACM collegiate challenge.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contests.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      c.status === 'LIVE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs text-slate-500">{c.durationMinutes} Mins</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block">Questions</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{c._count?.problems || 0}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block">Registered</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{c._count?.participants || 0}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block">Submissions</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{c._count?.submissions || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/contests/${c.slug}`}
                  target="_blank"
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  View Contest
                </Link>
                <Link
                  href={`/contests/${c.slug}/arena`}
                  target="_blank"
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-[#005596] hover:bg-[#004070] text-white font-semibold text-xs transition-colors"
                >
                  Open Arena IDE
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
