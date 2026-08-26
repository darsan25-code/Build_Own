import { BookOpen, Video, FileCode, Briefcase, GraduationCap, Archive, ExternalLink } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function ResourcesPage() {
  const resources = await db.resource.findMany({
    take: 8,
  });

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'learning': return <BookOpen className="w-6 h-6 text-[#005596]" />;
      case 'webinar': return <Video className="w-6 h-6 text-[#005596]" />;
      case 'article': return <FileCode className="w-6 h-6 text-[#005596]" />;
      case 'career': return <Briefcase className="w-6 h-6 text-[#005596]" />;
      case 'student': return <GraduationCap className="w-6 h-6 text-[#005596]" />;
      default: return <Archive className="w-6 h-6 text-[#005596]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold text-[#005596] uppercase tracking-wider">ACM Education & Career Development</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">ACM Learning Center & Career Hub</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Develop your skills. Advance your career in computer science, software engineering, and tech leadership.</p>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <div key={res.id} className="acm-card-hover p-6 flex flex-col justify-between text-center space-y-4">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center shadow-sm">
                {getIcon(res.category)}
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#005596] transition-colors">{res.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{res.description}</p>
            </div>

            <a
              href={res.url}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#005596] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Explore Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
