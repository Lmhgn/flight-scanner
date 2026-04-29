'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSavedCount } from '@/lib/savedTrips';

export default function Header() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getSavedCount());

    function onStorage() {
      setSavedCount(getSavedCount());
    }
    window.addEventListener('storage', onStorage);
    // Poll for count changes (bookmark toggles in same tab don't fire storage event)
    const interval = setInterval(() => setSavedCount(getSavedCount()), 1500);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { href: '/', label: 'Deals' },
    { href: '/saved', label: 'Saved', count: savedCount },
    { href: '/search', label: 'Search' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-surface-container-low shadow-[0_4px_20px_-10px_rgba(0,52,111,0.1)]">
      <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary font-headline">
            FlightFlux
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-headline text-sm font-medium tracking-wide">
            {navItems.map(({ href, label, count }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 transition-colors ${
                    active
                      ? 'text-primary font-bold border-b-2 border-primary pb-1'
                      : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  {label}
                  {count != null && count > 0 && (
                    <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/saved" className="p-2 hover:bg-surface-container rounded-lg transition-all duration-200 relative">
            <span
              className="material-symbols-outlined text-outline"
              style={{ fontVariationSettings: savedCount > 0 ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
