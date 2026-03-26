import { addMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import type { DealScore } from '@/types/flights';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMonthBuckets(count = 3): Array<{ label: string; month: string; start: Date; end: Date }> {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = addMonths(now, i);
    return {
      label: format(date, 'MMMM yyyy'),
      month: format(date, 'yyyy-MM'),
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  });
}

export function dealScoreLabel(score: DealScore): string {
  switch (score) {
    case 'great': return 'Great Deal';
    case 'good': return 'Good Deal';
    default: return 'Deal';
  }
}

export function dealScoreColor(score: DealScore): string {
  switch (score) {
    case 'great': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'good': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

export function savingsBadgeColor(savingsPercent: number): string {
  if (savingsPercent >= 40) return 'bg-emerald-500 text-white';
  if (savingsPercent >= 20) return 'bg-amber-500 text-white';
  return 'bg-slate-600 text-slate-200';
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'EEE d MMM');
}

export function formatDateMedium(dateStr: string): string {
  return format(new Date(dateStr), 'd MMM yyyy');
}

export function getDestinationGradient(category: string): string {
  const gradients: Record<string, string> = {
    'european-city': 'from-indigo-900 via-purple-900 to-slate-900',
    'beach-med': 'from-orange-900 via-amber-800 to-rose-900',
    'beach-canaries': 'from-yellow-800 via-orange-800 to-red-900',
    'transatlantic': 'from-slate-900 via-blue-950 to-indigo-950',
    'middle-east': 'from-amber-900 via-yellow-800 to-orange-900',
    'long-haul-asia': 'from-red-950 via-purple-950 to-slate-900',
    'long-haul-other': 'from-teal-950 via-cyan-950 to-slate-900',
  };
  return gradients[category] ?? 'from-slate-900 via-slate-800 to-slate-900';
}
