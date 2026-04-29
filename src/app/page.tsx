import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import DealsSection from '@/components/DealsSection';
import LastMinuteSection from '@/components/LastMinuteSection';
import FlexibleDateGrid from '@/components/FlexibleDateGrid';
import { getMockDeals, getLastMinuteDeals } from '@/lib/mockDeals';

export default function HomePage() {
  const deals = getMockDeals();
  const lastMinute = getLastMinuteDeals();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-10 py-12">
        {/* Hero header */}
        <header className="mb-16">
          <div className="max-w-4xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight mb-3 text-primary">
              Where to next?
            </h1>
            <p className="text-on-surface-variant text-base max-w-xl font-body">
              Deals pulled from Google Flights, ITA Matrix, Skyscanner, Skiplagged and Jack&apos;s Flight Club.
            </p>
          </div>
        </header>

        {/* Search form */}
        <section className="mb-20">
          <SearchForm />
        </section>

        {/* Last-minute deals */}
        <LastMinuteSection deals={lastMinute} />

        {/* Flexible date grid */}
        <FlexibleDateGrid />

        {/* Rolling deals by month */}
        <DealsSection deals={deals} />

      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-10 mt-auto border-t border-outline-variant/15">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <span className="font-headline font-bold text-on-surface">FlightFlux</span>
          <p className="text-xs text-outline">
            © {new Date().getFullYear()} — prices are indicative, always verify before booking
          </p>
        </div>
      </footer>
    </div>
  );
}
