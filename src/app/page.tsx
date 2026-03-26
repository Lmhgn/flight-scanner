import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import DealsSection from '@/components/DealsSection';
import { getMockDeals } from '@/lib/mockDeals';
import { Plane, Zap, Shield, Globe } from 'lucide-react';

const SOURCES = [
  { name: 'Google Flights', color: '#4285F4' },
  { name: 'ITA Matrix', color: '#34A853' },
  { name: 'Skyscanner', color: '#00A698' },
  { name: 'Skiplagged', color: '#FF6B35' },
  { name: "Jack's Flight Club", color: '#E63946' },
];

export default function HomePage() {
  const deals = getMockDeals();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-14 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="hero-glow absolute inset-0" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Tagline */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex gap-1">
              {SOURCES.map((s) => (
                <div
                  key={s.name}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                  title={s.name}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">Scanning {SOURCES.length} sources simultaneously</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-center text-white leading-tight mb-4">
            Your next adventure
            <br />
            <span className="gradient-text">starts with a deal</span>
          </h1>

          <p className="text-center text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-3">
            We scan Google Flights, ITA Matrix, Skyscanner, Skiplagged &amp; Jack&apos;s Flight Club
            to find hidden fares and error prices — so you can book on impulse.
          </p>

          {/* Source pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SOURCES.map((s) => (
              <span
                key={s.name}
                className="text-xs px-3 py-1 rounded-full border"
                style={{ color: s.color, backgroundColor: `${s.color}18`, borderColor: `${s.color}30` }}
              >
                {s.name}
              </span>
            ))}
          </div>

          {/* Search form */}
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: 'Error fares & flash sales',
              desc: "We catch mistake prices and 48-hour flash sales the moment they're live.",
              color: 'text-amber-400',
            },
            {
              icon: Shield,
              title: 'Hidden city tickets',
              desc: 'Via Skiplagged — sometimes booking a connecting flight and getting off early is cheaper.',
              color: 'text-blue-400',
            },
            {
              icon: Globe,
              title: 'All London airports',
              desc: 'Heathrow, Gatwick, Stansted, Luton & City — we check all five so you get the best deal.',
              color: 'text-emerald-400',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card rounded-2xl p-5 flex gap-4">
              <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rolling deals */}
      <DealsSection deals={deals} />

      {/* London airports reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-white/5">
        <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
          <Plane className="w-4 h-4" /> London departure airports
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { code: 'LHR', name: 'Heathrow', airlines: 'BA, VS, EK, QR' },
            { code: 'LGW', name: 'Gatwick', airlines: 'EZY, DY, LS, VS' },
            { code: 'STN', name: 'Stansted', airlines: 'FR, W6, EZY' },
            { code: 'LTN', name: 'Luton', airlines: 'EZY, W6, FR' },
            { code: 'LCY', name: 'City', airlines: 'BA CityFlyer, KL' },
          ].map((apt) => (
            <div key={apt.code} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="text-center">
                <p className="text-sm font-bold text-blue-400">{apt.code}</p>
              </div>
              <div>
                <p className="text-sm text-white font-medium">{apt.name}</p>
                <p className="text-xs text-slate-500">{apt.airlines}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-blue-400" />
            <span>FlightScanner</span>
          </div>
          <p className="text-xs text-center">
            Prices are indicative and may vary. Always confirm on the booking platform.
            Hidden city ticketing may violate airline terms.
          </p>
          <div className="flex gap-4">
            {SOURCES.map((s) => (
              <span key={s.name} className="text-xs" style={{ color: s.color }}>
                {s.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
