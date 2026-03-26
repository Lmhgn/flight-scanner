import type { Flight } from '@/types/flights';
import { formatPrice, formatDateShort } from '@/lib/utils';
import SourceLinks from './SourceLinks';
import { Plane, Clock, ArrowRight } from 'lucide-react';

const AIRLINE_NAMES: Record<string, string> = {
  BA: 'British Airways', EZY: 'easyJet', FR: 'Ryanair',
  U2: 'easyJet', W6: 'Wizz Air', LS: 'Jet2', DY: 'Norwegian',
  KL: 'KLM', EK: 'Emirates', QR: 'Qatar Airways', VS: 'Virgin Atlantic',
  IB: 'Iberia', TP: 'TAP Portugal', VY: 'Vueling', SK: 'SAS',
  AF: 'Air France', LH: 'Lufthansa', AZ: 'ITA Airways', JL: 'Japan Airlines',
  SQ: 'Singapore Airlines', TK: 'Turkish Airlines', EY: 'Etihad',
};

const DEAL_BADGE: Record<string, string> = {
  great: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  good: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  normal: '',
};

function AirlineIcon({ code }: { code: string }) {
  // Use the airline initial as a simple visual
  const colors: Record<string, string> = {
    BA: '#075AAA', EZY: '#FF6600', FR: '#073590', U2: '#FF6600',
    W6: '#C8102E', LS: '#003087', DY: '#D81E32', KL: '#00A0DE',
    EK: '#C41830', QR: '#5C0032', VS: '#E00025', EK2: '#C41830',
  };
  const bg = colors[code] ?? '#1e3a5f';
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: bg }}
    >
      {code.slice(0, 2)}
    </div>
  );
}

interface Props {
  flight: Flight;
  departureDate: string;
  returnDate?: string;
}

export default function FlightCard({ flight, departureDate, returnDate }: Props) {
  const isGreat = flight.dealScore === 'great';
  const outbound = flight.outbound[0];
  const lastOutbound = flight.outbound[flight.outbound.length - 1];
  const depTime = outbound.departureTime.includes('T')
    ? new Date(outbound.departureTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : outbound.departureTime;
  const arrTime = lastOutbound.arrivalTime.includes('T')
    ? new Date(lastOutbound.arrivalTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : lastOutbound.arrivalTime;

  return (
    <div className={`flight-card rounded-2xl p-4 sm:p-5 ${isGreat ? 'ring-1 ring-emerald-500/20' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Airline + flight info */}
        <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
          <AirlineIcon code={flight.airlineCode} />
          <div>
            <p className="text-sm font-semibold text-slate-200">
              {AIRLINE_NAMES[flight.airlineCode] ?? flight.airline}
            </p>
            <p className="text-xs text-slate-500">{flight.outbound[0].flightNumber}</p>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex-1 flex items-center gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{depTime}</p>
            <p className="text-xs text-slate-500">{outbound.departureAirport}</p>
            <p className="text-xs text-slate-600">{formatDateShort(departureDate)}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {flight.totalDuration}
            </div>
            <div className="w-full flex items-center">
              <div className="flex-1 h-px bg-slate-700" />
              <Plane className="w-3.5 h-3.5 text-slate-600 mx-1 flex-shrink-0" />
              <div className="flex-1 h-px bg-slate-700" />
            </div>
            <p className="text-xs text-slate-500">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-white">{arrTime}</p>
            <p className="text-xs text-slate-500">{lastOutbound.arrivalAirport}</p>
            {returnDate && <p className="text-xs text-slate-600">{formatDateShort(returnDate)}</p>}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:w-36 flex-shrink-0">
          <div className="text-right">
            {flight.dealScore !== 'normal' && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DEAL_BADGE[flight.dealScore]}`}>
                {flight.dealScore === 'great' ? 'Great Deal' : 'Good Deal'}
              </span>
            )}
            <p className="text-2xl font-black text-white mt-1">{formatPrice(flight.price)}</p>
            <p className="text-xs text-slate-500">per person</p>
          </div>
        </div>
      </div>

      {/* Source links row */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SourceLinks links={flight.sourceLinks} compact />
        <a
          href={flight.sourceLinks.find((l) => l.source === 'skyscanner')?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium ml-auto"
        >
          Book now <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
