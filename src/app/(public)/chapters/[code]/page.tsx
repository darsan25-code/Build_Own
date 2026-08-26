import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/server/db/client';
import { Globe, Building, Users, Calendar, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

interface Props {
  params: { code: string };
}

export default async function ChapterDetailPage({ params }: Props) {
  const chapter = await db.chapter.findUnique({
    where: { code: params.code },
    include: {
      institution: true,
      officers: { include: { user: true } },
      memberships: { include: { user: true } },
      events: true,
    },
  });

  if (!chapter) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/chapters" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Chapters</span>
      </Link>

      {/* Main Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#005596] text-xs font-bold rounded">{chapter.code}</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                Status: {chapter.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{chapter.name}</h1>
            <p className="text-xs text-slate-500">
              {chapter.institution.name} • {chapter.institution.location}, {chapter.institution.country}
            </p>
          </div>

          <button className="px-6 py-2.5 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg shadow transition-colors">
            Join Chapter
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          {chapter.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-[#005596]">{chapter.memberships.length}</div>
            <div className="text-xs text-slate-500">Members</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-[#005596]">{chapter.officers.length}</div>
            <div className="text-xs text-slate-500">Officers</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xl font-bold text-[#005596]">{chapter.events.length}</div>
            <div className="text-xs text-slate-500">Events</div>
          </div>
        </div>
      </div>

      {/* Officers List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#005596]" />
          <span>Chapter Officers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {chapter.officers.map((off) => (
            <div key={off.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{off.user.name}</div>
                <div className="text-[11px] text-slate-500">{off.user.email}</div>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-[#005596] font-semibold text-[10px] rounded">
                {off.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
