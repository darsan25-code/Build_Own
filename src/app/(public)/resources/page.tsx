import { BookOpen, Video, FileCode, Briefcase, GraduationCap, Archive, ExternalLink, Sparkles } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function ResourcesPage() {
  const resources = await db.resource.findMany({
    take: 8,
  });

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'learning': return <BookOpen className="w-6 h-6 text-cyan-300" />;
      case 'webinar': return <Video className="w-6 h-6 text-[#00A3E0]" />;
      case 'article': return <FileCode className="w-6 h-6 text-indigo-400" />;
      case 'career': return <Briefcase className="w-6 h-6 text-emerald-400" />;
      case 'student': return <GraduationCap className="w-6 h-6 text-amber-400" />;
      default: return <Archive className="w-6 h-6 text-cyan-300" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-[#071225] to-[#0B3B78] border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-[-20%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>ACM EDUCATION &amp; CAREER DEVELOPMENT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ACM Learning Center &amp; Career Hub
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
            Develop your skills. Advance your career in computer science, software engineering, and tech leadership.
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <div 
            key={res.id} 
            className="group bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-cyan-400/50 rounded-2xl p-6 shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between text-center space-y-4"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-md">
                {getIcon(res.category)}
              </div>
              <span className="text-[11px] font-mono font-bold text-[#00A3E0] uppercase tracking-wider block">{res.category}</span>
              <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#00A3E0] transition-colors">{res.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{res.description}</p>
            </div>

            <a
              href={res.url}
              className="w-full py-3 px-4 bg-slate-950/80 group-hover:bg-[#005596] text-[#00A3E0] group-hover:text-white border border-slate-800 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <span>Explore Resource</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
