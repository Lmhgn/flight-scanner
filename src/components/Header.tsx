import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-surface-container-low shadow-[0_4px_20px_-10px_rgba(0,52,111,0.1)]">
      <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary font-headline">
            FlightFlux
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-headline text-sm font-medium tracking-wide">
            <Link
              href="/"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              Explore Deals
            </Link>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">Saved Trips</a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">Price Tracker</a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">Settings</a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-container rounded-lg transition-all duration-200">
            <span className="material-symbols-outlined text-outline">notifications</span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded-lg transition-all duration-200">
            <span className="material-symbols-outlined text-outline">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
