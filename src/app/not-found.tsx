import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#005596] mx-auto flex items-center justify-center border border-blue-100 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#005596] uppercase tracking-wider">Error 404</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested resource or page does not exist or has been moved. Check the URL or return to home.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
