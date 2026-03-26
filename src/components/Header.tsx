import Link from 'next/link';
import { Plane, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020914]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Flight<span className="text-blue-400">Scanner</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <div className="live-dot" />
            <span>Live prices</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">5 sources checked</span>
          </div>

          <a
            href="https://www.jacksflight.club"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Jack&apos;s Flight Club
          </a>
        </div>
      </div>
    </header>
  );
}
