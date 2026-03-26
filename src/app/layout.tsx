import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flight Scanner — Hidden Deals from London',
  description:
    'Find hidden flight deals from London. We scan Google Flights, Skyscanner, Skiplagged, ITA Matrix and more to find the cheapest fares.',
  keywords: 'cheap flights London, flight deals, Skyscanner, Google Flights, error fares, hidden city ticketing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✈️</text></svg>" />
      </head>
      <body className="min-h-screen bg-[#020914] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
