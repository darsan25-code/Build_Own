'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, User, LogOut, LayoutDashboard, Award, 
  Menu, X, ChevronDown, CheckCircle2, Home, Users, 
  Calendar, Trophy, BookOpen, Layers
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

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as Node | null;
      if (!target) return;

      if (document.body && !document.body.contains(target)) {
        return;
      }

      const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      if (!isInsideDropdown) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      window.location.href = '/';
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home, exact: true },
    { href: '/membership', label: 'Membership', icon: Users },
    { href: '/chapters', label: 'Chapters', icon: Layers },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/contests', label: 'Contests', icon: Trophy, badge: 'Live' },
    { href: '/publications', label: 'Publications', icon: BookOpen },
    { href: '/resources', label: 'Resources', icon: Award },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 transition-all w-full relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4 lg:gap-6 w-full">
          
          {/* LEFT: Branding Group (ACM Logo + Vel Tech Emblem) */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 min-w-0 flex-shrink">
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

          {/* RIGHT: Search, Profile Control & Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              type="button"
              aria-label="Search platform"
              className="p-2 text-slate-500 hover:text-[#005596] rounded-xl hover:bg-slate-100/80 transition-colors flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {sessionUser ? (
              <div className="relative" ref={dropdownRef} data-profile-dropdown="true">
                {/* Unified Account Trigger Control Pill */}
                <button
                  type="button"
                  data-profile-dropdown="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(false);
                    setDropdownOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 min-w-[44px] min-h-[44px] rounded-xl bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/80 text-slate-800 font-semibold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#005596]/20 shadow-xs cursor-pointer select-none touch-manipulation active:scale-[0.98]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User profile and account menu"
                  title="Account Menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#005596] text-white font-extrabold text-xs flex items-center justify-center shadow-xs flex-shrink-0 border border-white">
                    {sessionUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left leading-none">
                    <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{sessionUser.name.split(' ')[0]}</span>
                    <span className="text-[9.5px] font-bold text-[#005596] mt-0.5">Active Member</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#005596]' : ''}`} />
                </button>

                {/* Profile Account Popover Panel */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 max-w-[calc(100vw-24px)] bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden animate-fade-in p-2 space-y-1">
                    {/* Identity Header */}
                    <div className="p-3 bg-slate-50/90 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#005596] text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0 border border-white">
                          {sessionUser.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-slate-900 truncate">{sessionUser.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{sessionUser.email}</div>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Student Member
                        </span>
                      </div>
                    </div>

                    {/* Popover Nav Actions */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        href={
                          sessionUser.role === 'PLATFORM_ADMIN'
                            ? '/platform-admin'
                            : sessionUser.role === 'CHAPTER_ADMIN' || sessionUser.role === 'CHAPTER_OFFICER'
                            ? '/chapter-admin'
                            : '/student'
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer min-h-[42px]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#005596]" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/student/profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer min-h-[42px]"
                      >
                        <User className="w-4 h-4 text-[#005596]" />
                        <span>Profile &amp; Settings</span>
                      </Link>

                      <Link
                        href="/student/certificates"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#005596] hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer min-h-[42px]"
                      >
                        <Award className="w-4 h-4 text-[#005596]" />
                        <span>My Certificates</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer select-none min-h-[42px]"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#005596] hover:bg-[#005596]/10 rounded-xl transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Join ACM
                </Link>
              </div>
            )}

            {/* Mobile/Tablet Hamburger Button (< lg: 1024px) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen(false);
                setMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#005596] shadow-sm flex items-center justify-center flex-shrink-0 cursor-pointer select-none touch-manipulation transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 relative z-50"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200 text-[#005596]" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN PANEL & BACKDROP (< lg: 1024px) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay for outside tap closure */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 top-16 sm:top-18 bg-slate-950/40 z-40 animate-fade-in"
            aria-hidden="true"
          />

          {/* Solid Opaque Mobile Navigation Panel Container */}
          <div className="lg:hidden fixed top-16 sm:top-18 left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 animate-fade-in p-4 space-y-2 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
            {!sessionUser && (
              <div className="grid grid-cols-2 gap-2.5 pb-3 border-b border-slate-100 mb-2 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center border border-slate-200 text-[#005596] rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center bg-[#005596] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#003B6E] transition-colors shadow-sm cursor-pointer"
                >
                  Join ACM
                </Link>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[48px] cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-[#005596] border border-blue-100 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-[#005596]' : 'text-slate-500'}`} />
                      <span className="text-slate-900 font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-emerald-500 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {sessionUser && (
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-1">
                <Link
                  href="/student/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#005596] transition-colors min-h-[48px] cursor-pointer"
                >
                  <User className="w-4.5 h-4.5 text-[#005596]" />
                  <span>Profile &amp; Settings</span>
                </Link>
                <Link
                  href="/student/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#005596] transition-colors min-h-[48px] cursor-pointer"
                >
                  <Award className="w-4.5 h-4.5 text-[#005596]" />
                  <span>My Certificates</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors min-h-[48px] text-left cursor-pointer select-none"
                >
                  <LogOut className="w-4.5 h-4.5 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
