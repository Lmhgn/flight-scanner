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
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        {children}
      </body>
    </html>
  );
}
