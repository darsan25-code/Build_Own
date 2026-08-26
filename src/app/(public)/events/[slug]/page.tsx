import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/server/db/client';
import { getCurrentUser } from '@/server/security/auth';
import { Calendar, MapPin, Clock, Users, Award, Building, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await db.event.findUnique({
    where: { slug: params.slug },
    include: {
      chapter: { include: { institution: true } },
      institution: true,
      registrations: true,
    },
  });

  if (!event) {
    notFound();
  }

  const user = await getCurrentUser();
  const isRegistered = user
    ? event.registrations.some((r) => r.userId === user.id)
    : false;

  const dateObj = new Date(event.startTime);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/events" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Events</span>
      </Link>

      {/* Main Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 bg-blue-50 text-[#005596] rounded">{event.type.replace('_', ' ')}</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded">{event.format}</span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded">
              Capacity: {event.currentRegistrations}/{event.maxCapacity}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {event.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Calendar className="w-5 h-5 text-[#005596]" />
            <div>
              <div className="font-semibold text-slate-900">Date & Time</div>
              <div className="text-slate-500">{dateStr} at {timeStr}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <MapPin className="w-5 h-5 text-[#005596]" />
            <div>
              <div className="font-semibold text-slate-900">Location</div>
              <div className="text-slate-500">{event.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Building className="w-5 h-5 text-[#005596]" />
            <div>
              <div className="font-semibold text-slate-900">Host Chapter</div>
              <div className="text-slate-500">{event.chapter.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Award className="w-5 h-5 text-[#005596]" />
            <div>
              <div className="font-semibold text-slate-900">Certificate</div>
              <div className="text-slate-500">
                {event.certificateEligible ? 'Verifiable Digital Certificate Included' : 'No Certificate'}
              </div>
            </div>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Deadline: <span className="font-semibold text-slate-800">{new Date(event.registrationDeadline).toLocaleDateString()}</span>
          </div>

          {isRegistered ? (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are Registered</span>
            </div>
          ) : (
            <Link
              href="/events"
              className="px-6 py-2.5 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              Register on Events Portal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
