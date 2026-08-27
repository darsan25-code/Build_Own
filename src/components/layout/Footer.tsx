import Link from 'next/link';
import { BrandLogos } from './BrandLogos';

export function Footer() {
  return (
    <footer className="bg-[#0B1E3D] text-slate-300 border-t border-slate-800/80 pt-12 sm:pt-16 pb-8 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
          
          {/* Column 1: Branding & Description (Spans 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogos variant="footer" />
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-lg pt-2 font-normal">
              Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College ACM Student Chapter, Avadi, Chennai. Advancing Computing as a Science &amp; Profession.
            </p>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/membership" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Membership Types
                </Link>
              </li>
              <li>
                <Link href="/chapters" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Student Chapters
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Conferences &amp; Tech Talks
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Digital Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Policies (Spans 2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Governance</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/resources" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Code of Ethics
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Security &amp; Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Support (Spans 2.5 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Contact Support</h4>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              Need assistance with chapter registration or membership?
            </p>
            <div className="pt-1">
              <a
                href="mailto:support@acm.org"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00A3E0] hover:text-sky-300 hover:underline transition-colors"
              >
                <span>support@acm.org</span>
              </a>
            </div>
          </div>

        </div>

        {/* Subtle Horizontal Container Divider */}
        <div className="border-t border-slate-800/90 pt-6 text-center text-xs sm:text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} Association for Computing Machinery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
