import type { Flight } from '@/types/flights';
import { formatPrice } from '@/lib/utils';

const AIRLINE_NAMES: Record<string, string> = {
  BA: 'British Airways', EZY: 'easyJet', FR: 'Ryanair', U2: 'easyJet',
  W6: 'Wizz Air', LS: 'Jet2', DY: 'Norwegian', KL: 'KLM',
  EK: 'Emirates', QR: 'Qatar Airways', VS: 'Virgin Atlantic',
  IB: 'Iberia', TP: 'TAP Portugal', VY: 'Vueling',
  AF: 'Air France', LH: 'Lufthansa', AZ: 'ITA Airways',
  JL: 'Japan Airlines', SQ: 'Singapore Airlines',
};

const SOURCE_BADGE: Record<string, { label: string; style: string }> = {
  skiplagged:         { label: 'Hidden City (Skiplagged)',   style: 'glass-badge text-on-secondary-container' },
  ita_matrix:         { label: 'ITA Matrix Deep Search',     style: 'bg-tertiary-container/10 text-on-tertiary-container' },
  google_flights:     { label: 'Signature Deal',             style: 'bg-primary/10 text-primary' },
  jacks_flight_club:  { label: "Jack's Flight Club Pick",    style: 'bg-error-container/60 text-on-error-container' },
  default:            { label: 'Signature Deal',             style: 'bg-primary/10 text-primary' },
};

const DEAL_STATUS: Record<string, { icon: string; label: string; style: string; detail: string }> = {
  great: {
    icon: 'check_circle',
    label: 'On-Time',
    style: 'bg-secondary-container text-on-secondary-container',
    detail: 'Verified pricing, frequently operated route',
  },
  good: {
    icon: 'trending_down',
    label: '-25% vs Avg',
    style: 'bg-secondary-container text-on-secondary-container',
    detail: 'Lowest price in the last 30 days',
  },
  normal: {
    icon: 'report',
    label: 'Short Connect',
    style: 'bg-error-container text-on-error-container',
    detail: 'Allow extra time for connection',
  },
};

function formatTime(isoOrTime: string): string {
  try {
    if (isoOrTime.includes('T')) {
      return new Date(isoOrTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return isoOrTime;
  } catch {
    return isoOrTime;
  }
}

interface Props {
  flight: Flight;
}

export default function FlightCard({ flight }: Props) {
  const outbound = flight.outbound[0];
  const lastSeg = flight.outbound[flight.outbound.length - 1];
  const depTime = formatTime(outbound.departureTime);
  const arrTime = formatTime(lastSeg.arrivalTime);

  const primarySrc = flight.primarySource ?? 'google_flights';
  const badge = SOURCE_BADGE[primarySrc] ?? SOURCE_BADGE.default;
  const status = DEAL_STATUS[flight.dealScore];

  const bookUrl = flight.sourceLinks.find((l) => l.source === 'skyscanner')?.url
    ?? flight.sourceLinks[0]?.url
    ?? '#';

  const airlineName = AIRLINE_NAMES[flight.airlineCode] ?? flight.airline;
  const flightNum = flight.outbound[0].flightNumber;

  return (
    <div className="group bg-surface-container-lowest hover:bg-surface-bright transition-all duration-300 rounded-lg p-6 shadow-[0_4px_20px_-10px_rgba(0,52,111,0.05)] relative overflow-hidden">
      {/* Source badge */}
      <div className={`absolute top-0 right-0 ${badge.style} px-4 py-1.5 rounded-bl-lg`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{badge.label}</span>
      </div>

      <div className="grid grid-cols-12 items-center gap-4 md:gap-8">
        {/* Col 1-2: Airline */}
        <div className="col-span-12 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg flex-shrink-0">
              <span className="material-symbols-outlined text-primary">flight</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{airlineName}</p>
              <p className="text-[10px] text-outline font-medium">{flightNum}</p>
            </div>
          </div>
        </div>

        {/* Col 3-7: Flight timeline */}
        <div className="col-span-12 md:col-span-5 flex items-center justify-between px-0 md:px-4">
          <div className="text-center">
            <p className="text-xl font-headline font-extrabold">{depTime}</p>
            <p className="text-xs font-bold text-outline">{outbound.departureAirport}</p>
          </div>

          <div className="flex-grow px-4 text-center space-y-1">
            <p className="text-[10px] font-bold text-outline uppercase tracking-tighter">
              {flight.totalDuration} · {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
            </p>
            <div className="h-px bg-outline-variant/30 w-full relative">
              <div className="absolute -top-[3px] left-0 w-1.5 h-1.5 rounded-full bg-outline-variant" />
              {flight.stops > 0 && (
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-tertiary-container" />
              )}
              <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 rounded-full bg-outline-variant" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-headline font-extrabold">{arrTime}</p>
            <p className="text-xs font-bold text-outline">{lastSeg.arrivalAirport}</p>
          </div>
        </div>

        {/* Col 8-9: Status */}
        <div className="col-span-6 md:col-span-2 md:border-l border-outline-variant/15 md:pl-6">
          <div className={`inline-flex items-center gap-1.5 ${status.style} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1`}>
            <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
            {status.label}
          </div>
          <p className="text-[10px] text-outline leading-snug">{status.detail}</p>
        </div>

        {/* Col 10-12: Price + CTA */}
        <div className="col-span-6 md:col-span-3 text-right space-y-3">
          <div>
            {flight.dealScore === 'great' && (
              <p className="text-[10px] font-bold text-error uppercase tracking-widest line-through decoration-1 opacity-60">
                £{Math.round(flight.price * 1.6)}
              </p>
            )}
            <p className="text-3xl font-headline font-extrabold text-primary tracking-tighter">
              {formatPrice(flight.price)}
            </p>
          </div>
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 primary-gradient text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-lg transition-all active:scale-[0.98] text-center"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
