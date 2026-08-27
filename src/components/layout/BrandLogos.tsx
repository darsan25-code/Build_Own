import Link from 'next/link';

export function BrandLogos({ variant = 'navbar' }: { variant?: 'navbar' | 'hero' | 'footer' }) {
  if (variant === 'footer') {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        {/* ACM Official Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90 flex-shrink-0">
          <div className="h-11 px-3 py-1.5 bg-white rounded-xl shadow-md flex items-center border border-slate-100">
            <img
              src="/images/acm_official_logo.svg"
              alt="Association for Computing Machinery"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
        </Link>

        <div className="hidden sm:block w-px h-10 bg-slate-700/80 flex-shrink-0" />

        {/* Vel Tech High Tech Institution */}
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <img
            src="/images/veltech_seal.png"
            alt="Vel Tech Seal"
            className="w-11 h-11 object-contain rounded-full shadow-md bg-white p-0.5 flex-shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-white text-xs sm:text-sm block leading-snug">
              Vel Tech High Tech
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 font-medium block leading-snug">
              Dr.Rangarajan Dr.Sakunthala Engineering College
            </span>
            <span className="text-[10.5px] font-bold text-[#00A3E0] block leading-snug mt-0.5">
              ACM Student Chapter
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 py-1 min-w-0 flex-shrink sm:flex-shrink-0">
      {/* 1. ACM Official Diamond Logo */}
      <Link href="/" className="flex items-center group transition-opacity hover:opacity-90 flex-shrink-0">
        <img
          src="/images/acm_official_logo.svg"
          alt="Association for Computing Machinery"
          className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      {/* 2. Sleek Vertical Divider */}
      <div className="h-6 sm:h-8 w-px bg-slate-200/80 hidden sm:block flex-shrink-0" />

      {/* 3. Vel Tech High Tech College Emblem & Typography */}
      <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group transition-opacity hover:opacity-90 min-w-0 flex-shrink sm:flex-shrink-0">
        <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center">
          <img
            src="/images/veltech_seal.png"
            alt="Vel Tech Official Seal"
            className="w-full h-full object-contain rounded-full shadow-sm"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0 overflow-hidden">
          <span className="font-extrabold text-slate-900 text-[10px] sm:text-xs md:text-[13px] lg:text-sm tracking-tight leading-tight truncate">
            Vel Tech High Tech
          </span>
          <span className="font-bold text-[#005596] text-[8.5px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-tight leading-tight mt-0.5 truncate">
            ACM Student Chapter
          </span>
        </div>
      </Link>
    </div>
  );
}
