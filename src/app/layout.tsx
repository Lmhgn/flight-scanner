import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlightFlux | Hidden Flight Deals from London',
  description:
    'Discover hidden flight deals from London. We scan Google Flights, Skyscanner, ITA Matrix, Skiplagged and Jack\'s Flight Club for the cheapest fares and error prices.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        {children}
      </body>
    </html>
  );
}
