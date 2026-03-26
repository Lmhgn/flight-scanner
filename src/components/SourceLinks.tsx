'use client';

import type { SourceLink } from '@/types/flights';
import { ExternalLink } from 'lucide-react';

interface Props {
  links: SourceLink[];
  price?: number;
  compact?: boolean;
}

export default function SourceLinks({ links, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {links.map((link) => (
          <a
            key={link.source}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-btn"
            style={{
              color: link.color,
              backgroundColor: link.bgColor,
              borderColor: `${link.color}30`,
            }}
            title={`Search on ${link.label}`}
          >
            {link.label === "Jack's Flight Club" ? "Jack's" : link.label.split(' ')[0]}
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500 mb-2">Check price on:</p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.source}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-btn text-sm"
            style={{
              color: link.color,
              backgroundColor: link.bgColor,
              borderColor: `${link.color}30`,
            }}
          >
            {link.label}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
}
