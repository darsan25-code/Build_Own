import Link from 'next/link';
import { CheckCircle2, Shield, Users, Award, Sparkles, BookOpen, Globe } from 'lucide-react';

export default function MembershipPage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Hero Header Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-[#071225] to-[#0B3B78] border border-slate-800/90 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-white my-2">
        <div className="absolute top-[-15%] right-[-5%] w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>GLOBAL COMPUTING SOCIETY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Join the World’s Premier Computing Society
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            Access exclusive learning resources, Digital Library archives, student travel grants, and a global academic network.
          </p>
        </div>
      </section>

      {/* Membership Tiers Grid */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Student Membership */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#00A3E0] text-white text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-md">
              Most Popular
            </div>

            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">Student Tier</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Student Membership</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">For undergraduate and graduate students enrolled in computing programs.</p>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                $19 <span className="text-xs text-slate-400 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Full access to ACM Learning Center &amp; Skill Paths</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Digital Library student subscription rate</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Eligible for Student Chapter officer roles</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Verified digital certificate credentials</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/signup"
                className="block text-center py-3 bg-[#00A3E0] hover:bg-[#008cc0] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all min-h-[44px]"
              >
                Join as Student
              </Link>
            </div>
          </div>

          {/* Professional Membership */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Professional Tier</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Professional Membership</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">For industry engineers, researchers, and computing practitioners.</p>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                $99 <span className="text-xs text-slate-400 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Full Communications of the ACM subscription</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Professional chapter mentorship eligibility</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Voting privileges in ACM general elections</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/signup"
                className="block text-center py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold rounded-xl border border-slate-700 active:scale-[0.98] transition-all min-h-[44px]"
              >
                Join as Professional
              </Link>
            </div>
          </div>

          {/* Academic Tier */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Academic Tier</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Faculty &amp; Educator</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">For professors, researchers, and chapter faculty advisors.</p>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                $49 <span className="text-xs text-slate-400 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Faculty sponsor rights for Student Chapters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Educational resources &amp; curriculum support</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>ACM Special Interest Group (SIG) discounts</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/signup"
                className="block text-center py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold rounded-xl border border-slate-700 active:scale-[0.98] transition-all min-h-[44px]"
              >
                Join as Faculty
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
