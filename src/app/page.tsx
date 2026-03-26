import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import DealsSection from '@/components/DealsSection';
import { getMockDeals } from '@/lib/mockDeals';

export default function HomePage() {
  const deals = getMockDeals();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-10 py-12">
        {/* Hero header */}
        <header className="mb-16">
          <div className="max-w-4xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight mb-4 text-primary">
              Where to next, London?
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-body">
              Access curated, hidden flight data and institutional pricing normally reserved for industry insiders.
              We scan Google Flights, ITA Matrix, Skyscanner, Skiplagged &amp; Jack&apos;s Flight Club simultaneously.
            </p>
          </div>
        </header>

        {/* Search form */}
        <section className="mb-20">
          <SearchForm />
        </section>

        {/* Rolling deals by month */}
        <DealsSection deals={deals} />

        {/* CTA banner */}
        <section className="mt-24 py-16 px-12 rounded-2xl primary-gradient text-on-primary relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-headline text-4xl font-extrabold mb-6 leading-tight">
              Professional grade tools for the everyday traveller.
            </h2>
            <p className="text-primary-fixed-dim text-lg mb-8">
              Access our proprietary algorithm that scans ITA Matrix and GDS systems for pricing errors
              and unpublished fares.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-secondary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity text-on-secondary">
                Start Tracking
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">
                View Methods
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 hidden lg:flex items-center justify-end pr-8">
            <span className="material-symbols-outlined" style={{ fontSize: '220px' }}>travel_explore</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-10 mt-auto bg-surface-container-low border-t border-outline-variant/15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-center gap-8 max-w-[1600px] mx-auto">
          <div className="space-y-2">
            <span className="font-headline font-bold text-lg text-on-surface">FlightFlux</span>
            <p className="font-body text-xs uppercase tracking-widest text-outline">
              © {new Date().getFullYear()} FlightFlux. Editorial Aviation &amp; High-Trust Travel.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 lg:gap-12">
            {['About Us', 'Hidden Deals Guide', 'Privacy', 'Terms', 'API Access'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-body text-xs uppercase tracking-widest text-outline hover:underline decoration-secondary underline-offset-4 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
