'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, User, LogOut, LayoutDashboard, Award, 
  Menu, X, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { BrandLogos } from './BrandLogos';

export function Navbar() {
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setSessionUser(data.user);
      })
      .catch(() => setSessionUser(null));
  }, [pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking/tapping outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as Node | null;
      if (!target) return;

      // Ignore if target was detached/unmounted during event cycle on iOS Safari
      if (document.body && !document.body.contains(target)) {
        return;
      }

      // Ignore if click/tap occurred inside dropdown container (trigger + dropdown)
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }

      setDropdownOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home', exact: true },
    { href: '/membership', label: 'Membership' },
    { href: '/chapters', label: 'Chapters' },
    { href: '/events', label: 'Events' },
    { href: '/contests', label: 'Contests', badge: 'Live' },
    { href: '/publications', label: 'Publications' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4 lg:gap-6 w-full">
          
          {/* LEFT: Branding Group (ACM Logo + Vel Tech Emblem) */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 min-w-0 flex-shrink sm:flex-shrink-0">
            <BrandLogos variant="navbar" />
            <div className="h-7 w-px bg-slate-200 hidden lg:block flex-shrink-0" />
          </div>

          {/* CENTER: Navigation Links (Desktop lg: 1024px+) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-medium text-slate-700 select-none flex-1 justify-center">
            {navLinks.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1.5 transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                    isActive
                      ? 'text-[#005596] font-bold after:absolute after:-bottom-[21px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#005596] after:rounded-full'
                      : 'hover:text-[#005596]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-emerald-500 text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Search & User Account Area */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              aria-label="Search platform"
              className="p-2 text-slate-500 hover:text-[#005596] rounded-xl hover:bg-slate-100/80 transition-colors flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            {sessionUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Compact User Account Trigger Pill */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((prev) => !prev);
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-100 text-slate-800 font-semibold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#005596]/20 shadow-sm"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  title="Account Menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#005596] text-white font-extrabold text-xs flex items-center justify-center shadow-sm flex-shrink-0 border border-white">
                    {sessionUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left leading-none">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{sessionUser.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-semibold text-[#005596] mt-0.5">Active Member</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Popover Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in p-1.5 space-y-1">
                    {/* User Identity Header */}
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-extrabold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                          {sessionUser.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-slate-900 truncate">{sessionUser.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{sessionUser.email}</div>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Student Member
                        </span>
                      </div>
                    </div>

                    {/* Popover Links */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        href={
                          sessionUser.role === 'PLATFORM_ADMIN'
                            ? '/platform-admin'
                            : sessionUser.role === 'CHAPTER_ADMIN' || sessionUser.role === 'CHAPTER_OFFICER'
                            ? '/chapter-admin'
                            : '/student'
                        }
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#005596]" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/student/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-[#005596]" />
                        <span>Profile &amp; Settings</span>
                      </Link>

                      <Link
                        href="/student/certificates"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors"
                      >
                        <Award className="w-4 h-4 text-[#005596]" />
                        <span>My Certificates</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#005596] hover:bg-[#005596]/10 rounded-xl transition-colors hidden sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span className="hidden sm:inline">Join ACM</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button (< lg: 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center flex-shrink-0"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (< lg: 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto">
          {sessionUser ? (
            <div className="pb-3 border-b border-slate-100 mb-2 space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    {sessionUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{sessionUser.name}</div>
                    <div className="text-[10.5px] text-slate-500 truncate">{sessionUser.email}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full flex-shrink-0">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={
                    sessionUser.role === 'PLATFORM_ADMIN'
                      ? '/platform-admin'
                      : sessionUser.role === 'CHAPTER_ADMIN' || sessionUser.role === 'CHAPTER_OFFICER'
                      ? '/chapter-admin'
                      : '/student'
                  }
                  className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 text-[#005596] border border-blue-100 rounded-xl text-xs font-bold shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/student/profile"
                  className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors"
                >
                  <User className="w-4 h-4 text-[#005596]" />
                  <span>Profile &amp; Settings</span>
                </Link>

                <Link
                  href="/student/certificates"
                  className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Award className="w-4 h-4 text-[#005596]" />
                  <span>Certificates</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pb-3 border-b border-slate-100 mb-2 grid grid-cols-2 gap-2 sm:hidden">
              <Link
                href="/login"
                className="py-2.5 px-3 text-center border border-slate-200 text-[#005596] rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="py-2.5 px-3 text-center bg-[#005596] text-white rounded-xl text-xs font-bold hover:bg-[#003B6E] transition-colors shadow-sm"
              >
                Join ACM
              </Link>
            </div>
          )}

          {navLinks.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-blue-50 text-[#005596] border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
