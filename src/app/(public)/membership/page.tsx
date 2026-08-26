import Link from 'next/link';
import { CheckCircle2, Shield, Users, Award, Sparkles, BookOpen } from 'lucide-react';

export default function MembershipPage() {
  return (
    <div className="space-y-5 pb-6">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#003B6E] via-[#005596] to-[#0072CE] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold">
            ACM Membership Tiers
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Join the World’s Premier Computing Society</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl">
            Access exclusive learning resources, Digital Library archives, student travel grants, and a global academic network.
          </p>
        </div>
      </section>

      {/* Membership Tiers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Student Membership */}
          <div className="bg-white border-2 border-[#005596] rounded-xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#005596] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-[#005596] uppercase">Student Tier</div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Student Membership</h3>
                <p className="text-xs text-slate-500 mt-1">For undergraduate and graduate students enrolled in computing programs.</p>
              </div>

              <div className="text-3xl font-extrabold text-slate-900">
                $19 <span className="text-xs text-slate-500 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Full access to ACM Learning Center & Skill Paths</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Digital Library student subscription rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Eligible for Student Chapter officer roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified digital certificate credentials</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/signup"
                className="block text-center py-2 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg shadow transition-colors"
              >
                Join as Student
              </Link>
            </div>
          </div>

          {/* Professional Membership */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Professional Tier</div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Professional Membership</h3>
                <p className="text-xs text-slate-500 mt-1">For industry engineers, researchers, and computing practitioners.</p>
              </div>

              <div className="text-3xl font-extrabold text-slate-900">
                $99 <span className="text-xs text-slate-500 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Full Communications of the ACM subscription</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Professional chapter mentorship eligibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Voting privileges in ACM general elections</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/signup"
                className="block text-center py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Join as Professional
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Academic Tier</div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Faculty & Educator</h3>
                <p className="text-xs text-slate-500 mt-1">For professors, researchers, and chapter faculty advisors.</p>
              </div>

              <div className="text-3xl font-extrabold text-slate-900">
                $49 <span className="text-xs text-slate-500 font-normal">/ year</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Faculty Coordinator chapter sponsorship tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Research paper publishing privileges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Curriculum resources and courseware archives</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/signup"
                className="block text-center py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
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
