import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import FlightResults from '@/components/FlightResults';
import { ArrowLeft, Plane } from 'lucide-react';
import Link from 'next/link';
import { formatDateMedium } from '@/lib/utils';

interface SearchPageProps {
  searchParams: {
    origin?: string;
    originCity?: string;
    destination?: string;
    destinationCity?: string;
    departDate?: string;
    returnDate?: string;
    adults?: string;
    cabin?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const {
    origin = 'LON',
    originCity = 'London',
    destination = 'ANY',
    destinationCity = 'Anywhere',
    departDate,
    returnDate,
    adults = '1',
    cabin = 'ECONOMY',
  } = searchParams;

  const parsedAdults = parseInt(adults, 10);
  const depFormatted = departDate ? formatDateMedium(departDate) : '';
  const retFormatted = returnDate ? formatDateMedium(returnDate) : '';

  const hasValidSearch = !!(origin && destination && departDate && destination !== 'ANY');

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-14 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to deals
        </Link>

        {/* Search summary header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Plane className="w-4 h-4 text-blue-400" />
            <span>{originCity}</span>
            <span>→</span>
            <span className="text-white font-medium">{destinationCity}</span>
            {destination !== 'ANY' && (
              <span className="text-xs bg-white/6 px-2 py-0.5 rounded-full ml-1">({destination})</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            {depFormatted && <span>{depFormatted}</span>}
            {retFormatted && <span>→ {retFormatted}</span>}
            <span>{parsedAdults} passenger{parsedAdults !== 1 ? 's' : ''}</span>
            <span className="capitalize">{cabin.toLowerCase().replace('_', ' ')}</span>
          </div>
        </div>

        {/* Refine search (minimal) */}
        <div className="mb-8">
          <SearchForm minimal />
        </div>

        {/* Results */}
        {!hasValidSearch ? (
          <div className="text-center py-16">
            <p className="text-slate-300 font-medium text-lg mb-2">Choose a destination to search</p>
            <p className="text-slate-500 text-sm">
              Select a specific city above, or browse the deals on the{' '}
              <Link href="/" className="text-blue-400 hover:text-blue-300">home page</Link>.
            </p>
          </div>
        ) : (
          <FlightResults
            searchParams={{
              origin,
              destination,
              departDate: departDate ?? '',
              returnDate,
              adults: parsedAdults,
              cabin,
              originCity,
              destinationCity,
            }}
          />
        )}
      </div>
    </div>
  );
}
