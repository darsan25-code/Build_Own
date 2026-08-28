import { BookOpen, ExternalLink, Download, FileText, Sparkles } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function PublicationsPage() {
  const publications = await db.publication.findMany({
    take: 6,
    include: { author: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Editorial Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-[#071225] to-[#0B3B78] border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-[-20%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>ACM DIGITAL LIBRARY &amp; RESEARCH</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ACM Publications
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
            World-class research in computing, journals, magazines, and flagship proceedings.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-800 pb-4">
        {['Journals', 'Magazines', 'Proceedings', 'Books', 'Newsletters'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-xs font-mono font-extrabold rounded-xl transition-all ${
              idx === 0
                ? 'bg-[#00A3E0] text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Editorial Research Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {publications.map((pub) => (
          <div 
            key={pub.id} 
            className="group bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-cyan-400/50 rounded-2xl p-6 shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono font-extrabold text-[#00A3E0] uppercase tracking-wider">{pub.type}</div>
              <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#00A3E0] transition-colors">{pub.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">{pub.abstract}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a
                href={pub.externalUrl || '#'}
                className="w-full py-3 px-4 bg-slate-950/80 group-hover:bg-[#005596] text-[#00A3E0] group-hover:text-white border border-slate-800 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <span>View Publication</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
