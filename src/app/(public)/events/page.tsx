'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, CheckCircle2, AlertCircle, Sparkles, Building, Flame } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-[#050B1A] via-[#07173A] to-[#0A2147] border border-[#123B66] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-[-20%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#00AEEF]/10 text-cyan-300 border border-[#00AEEF]/30 backdrop-blur-md uppercase tracking-widest shadow-inner">
            <Flame className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <span>GLOBAL TECHNICAL ACTIVITIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ACM Technical Events &amp; Workshops
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
            Conferences, webinars, competitive programming rounds, and flagship multi-college student activities.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2.5 shadow-sm animate-slide-up ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/80 border-red-500/40 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#071A3A] backdrop-blur-xl border border-[#123B66] rounded-2xl p-4 shadow-xl space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#00AEEF] text-white text-xs font-bold rounded-xl shadow-md min-h-[40px]">
            Upcoming
          </button>
          <button className="px-4 py-2 text-slate-300 hover:text-white hover:bg-[#0A2147] text-xs font-semibold rounded-xl transition-colors min-h-[40px]">
            Past Events
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select className="px-3.5 py-2.5 text-xs border border-[#123B66] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-[#050B1A]/90 text-slate-200 font-medium">
            <option>All Types</option>
            <option>Technical Talk</option>
            <option>Workshop</option>
            <option>Symposium</option>
            <option>Conference</option>
          </select>

          <select className="px-3.5 py-2.5 text-xs border border-[#123B66] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-[#050B1A]/90 text-slate-200 font-medium">
            <option>All Locations</option>
            <option>Online</option>
            <option>New York, USA</option>
            <option>Bangalore, India</option>
          </select>

          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#123B66] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEF] text-white placeholder-slate-400 bg-[#050B1A]/90"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-300 bg-[#071A3A]/80 border border-[#123B66] rounded-2xl shadow-sm">
            <div className="w-7 h-7 border-2 border-[#00AEEF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading ACM events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-xs sm:text-sm text-slate-300 bg-[#071A3A]/80 border border-[#123B66] rounded-2xl shadow-sm">
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
                className="group bg-[#071A3A] backdrop-blur-md border border-[#123B66] hover:border-[#00AEEF]/50 rounded-2xl p-5 sm:p-6 shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider leading-none">{monthStr}</span>
                    <span className="text-xl font-extrabold leading-none mt-1">{dayStr}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-[#00AEEF] text-[10.5px] font-mono font-bold rounded-md border border-blue-500/20">
                        {evt.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {evt.format}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#00AEEF] transition-colors">{evt.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" />
                        {evt.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#00AEEF]" />
                        {timeStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#123B66] flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs font-extrabold text-white sm:hidden">
                    {evt.isPaid ? `$${evt.price}` : 'Free'}
                  </span>
                  <button
                    onClick={() => handleRegister(evt.id)}
                    disabled={registeringId === evt.id}
                    className="w-full sm:w-auto px-6 py-3 bg-[#00AEEF] hover:bg-[#008cc0] active:scale-[0.98] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60 min-h-[44px] flex items-center justify-center"
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
