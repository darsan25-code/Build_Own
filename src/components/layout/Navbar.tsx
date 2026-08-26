'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrandLogos } from './BrandLogos';

export function Navbar() {
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setSessionUser(data.user);
      })
      .catch(() => setSessionUser(null));
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-5 lg:gap-6">
          {/* Left Branding Group: ACM Logo + Divider + Vel Tech Branding + Divider */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
            <BrandLogos variant="navbar" />
            <div className="h-7 w-px bg-slate-200 hidden lg:block flex-shrink-0" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium text-slate-700 select-none flex-1 justify-start">
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
                      ? 'text-[#005596] font-bold after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2px] after:bg-[#005596] after:rounded-full'
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

          {/* Actions & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              aria-label="Search platform"
              className="p-2 text-slate-500 hover:text-[#005596] rounded-xl hover:bg-slate-100/80 transition-colors flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            {sessionUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Link
                  href={
                    sessionUser.role === 'PLATFORM_ADMIN'
                      ? '/platform-admin'
                      : sessionUser.role === 'CHAPTER_ADMIN' || sessionUser.role === 'CHAPTER_OFFICER'
                      ? '/chapter-admin'
                      : '/student'
                  }
                  className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100/80 text-[#005596] border border-blue-100 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex-shrink-0"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#005596] flex-shrink-0" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#005596] hover:bg-[#005596]/10 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Join ACM
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center flex-shrink-0"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          {sessionUser && (
            <div className="pb-2 border-b border-slate-100 mb-2">
              <Link
                href={
                  sessionUser.role === 'PLATFORM_ADMIN'
                    ? '/platform-admin'
                    : sessionUser.role === 'CHAPTER_ADMIN' || sessionUser.role === 'CHAPTER_OFFICER'
                    ? '/chapter-admin'
                    : '/student'
                }
                className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 text-[#005596] border border-blue-100 rounded-xl text-sm font-bold shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-[#005596]" />
                <span>Dashboard</span>
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
