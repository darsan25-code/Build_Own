'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events/list');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    setRegisteringId(eventId);
    setMessage(null);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      setMessage({ type: 'success', text: 'Registration confirmed! Check your student dashboard.' });
      fetchEvents();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">ACM Technical Events & Workshops</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Conferences, webinars, competitive programming, and flagship student activities.</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2.5 shadow-sm animate-slide-up ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#005596] text-white text-xs font-bold rounded-xl shadow-sm">
            Upcoming
          </button>
          <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors">
            Past Events
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] bg-white text-slate-700 font-medium">
            <option>All Types</option>
            <option>Technical Talk</option>
            <option>Workshop</option>
            <option>Symposium</option>
            <option>Conference</option>
          </select>

          <select className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] bg-white text-slate-700 font-medium">
            <option>All Locations</option>
            <option>Online</option>
            <option>New York, USA</option>
            <option>Bangalore, India</option>
          </select>

          <div className="relative flex-1 sm:w-52">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] text-slate-800 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-7 h-7 border-2 border-[#005596] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading ACM events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-xs sm:text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
            No upcoming events. Check back soon!
          </div>
        ) : (
          events.map((evt) => {
            const dateObj = new Date(evt.startTime);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.getDate();
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={evt.id}
                className="acm-card-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005596] border border-blue-100 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider leading-none">{monthStr}</span>
                    <span className="text-xl font-extrabold leading-none mt-1">{dayStr}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-[#005596] text-[10.5px] font-extrabold rounded-md border border-blue-100">
                        {evt.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {evt.format}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#005596] transition-colors">{evt.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#005596]" />
                        {evt.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#005596]" />
                        {timeStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-xs font-extrabold text-slate-900 sm:hidden">
                    {evt.isPaid ? `$${evt.price}` : 'Free'}
                  </span>
                  <button
                    onClick={() => handleRegister(evt.id)}
                    disabled={registeringId === evt.id}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow transition-all disabled:opacity-60"
                  >
                    {registeringId === evt.id ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
