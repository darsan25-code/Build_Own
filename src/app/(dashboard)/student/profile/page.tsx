import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/security/auth';
import { Edit3, CheckCircle2, User, Mail, Building, MapPin, Calendar, ShieldCheck } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header Inspired by Screen 10 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your personal details and academic affiliation.</p>
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
          <Edit3 className="w-3.5 h-3.5 text-[#005596]" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card Inspired by Screen 10 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Avatar & Key Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6">
          <div className="w-24 h-24 rounded-full bg-[#005596] text-white font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md">
            {user.name.charAt(0)}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <div className="text-xs text-slate-600 font-medium">Student Member • ACM ID: {user.studentId || '1234567'}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>

        {/* Profile Attributes Grid Inspired by Screen 10 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Full Name</span>
            <div className="font-bold text-slate-900">{user.name}</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Institution</span>
            <div className="font-bold text-slate-900">{user.institution?.name || 'XYZ College of Engineering'}</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Department</span>
            <div className="font-bold text-slate-900">{user.department || 'Computer Science and Engineering'}</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Year of Study</span>
            <div className="font-bold text-slate-900">{user.yearOfStudy || '3rd Year'}</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Location</span>
            <div className="font-bold text-slate-900">{user.institution?.location || 'Chennai, India'}</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Membership Status</span>
            <div className="flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active (Student)</span>
            </div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Member Since</span>
            <div className="font-bold text-slate-900">May 2024</div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Valid Till</span>
            <div className="font-bold text-slate-900">May 2026</div>
          </div>
        </div>

      </div>
    </div>
  );
}
