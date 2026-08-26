import { BookOpen, ExternalLink, Download, FileText } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function PublicationsPage() {
  const publications = await db.publication.findMany({
    take: 6,
    include: { author: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Header Inspired by Screen 7 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ACM Publications</h1>
        <p className="text-sm text-slate-500 mt-1">World-class research in computing, journals, and flagship proceedings.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['Journals', 'Magazines', 'Proceedings', 'Books', 'Newsletters'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              idx === 0
                ? 'bg-[#005596] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid Inspired by Screen 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {publications.map((pub) => (
          <div key={pub.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold text-[#005596] uppercase tracking-wider">{pub.type}</div>
              <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">{pub.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3">{pub.abstract}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <a
                href={pub.externalUrl || '#'}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#005596] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Publication</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
