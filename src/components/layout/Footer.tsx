import Link from 'next/link';
import { BrandLogos } from './BrandLogos';

export function Footer() {
  return (
    <footer className="bg-[#0B1E3D] text-slate-300 border-t border-slate-800 py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="mb-4">
            <BrandLogos variant="footer" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College ACM Student Chapter (Avadi, Chennai). Advancing Computing as a Science & Profession.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/membership" className="hover:text-white transition-colors">Membership Types</Link></li>
            <li><Link href="/chapters" className="hover:text-white transition-colors">Student Chapters</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Conferences & Tech Talks</Link></li>
            <li><Link href="/publications" className="hover:text-white transition-colors">Digital Library</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Governance & Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Code of Ethics</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Security & Audit</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Contact Support</h4>
          <p className="text-xs text-slate-400 mb-2">Need assistance with chapter registration or membership?</p>
          <a href="mailto:support@acm.org" className="text-xs text-[#00A3E0] hover:underline">
            support@acm.org
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Association for Computing Machinery. All rights reserved.
      </div>
    </footer>
  );
}
