import React, { useState } from 'react';
import { TimelineItemType, CategoryType } from '@/data/timelineData';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  item: TimelineItemType;
}

const categoryStyles: Record<CategoryType, { dot: string; pill: string; label: string }> = {
  cybersecurity:    { dot: 'bg-blue-400',    pill: 'border-blue-500/30 bg-blue-500/10 text-blue-300',          label: 'Security' },
  teaching:         { dot: 'bg-emerald-400', pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', label: 'Teaching' },
  'f&b':            { dot: 'bg-amber-400',   pill: 'border-amber-500/30 bg-amber-500/10 text-amber-300',       label: 'F&B' },
  entrepreneurship: { dot: 'bg-purple-400',  pill: 'border-purple-500/30 bg-purple-500/10 text-purple-300',    label: 'Building' },
};

const TimelineItem: React.FC<TimelineItemProps> = ({ item }) => {
  const [isByteDanceRevealed, setIsByteDanceRevealed] = useState(false);

  const visibleCategories = (Array.isArray(item.category) ? item.category : [item.category]) as CategoryType[];

  const isByteDance = item.id === 35;
  const displayCompany = isByteDance && isByteDanceRevealed ? 'TikTok' : item.coy;
  const logoUrl = isByteDance && isByteDanceRevealed ? './coylogo/tiktok.png' : item.logo;

  const isCurrent = /present/i.test(item.date);
  const isIntern = item.intern === 1;

  return (
    <article
      className={cn(
        'group relative w-full rounded-lg border border-white/[0.06] bg-card/70 backdrop-blur-sm',
        'px-3 py-2 transition-[border-color,background-color,transform,opacity] duration-200',
        'hover:border-white/[0.14] hover:bg-card/95 hover:translate-x-0.5',
        // Non-current roles dim back so currents read first. Hover restores
        // full opacity so the card you're reading is always crisp.
        !isCurrent && 'opacity-60 hover:opacity-100',
        isCurrent &&
          'border-cyber-cyan/40 shadow-[0_0_28px_-4px_rgba(139,92,246,0.32)] hover:border-cyber-cyan/60',
        isByteDance &&
          'cursor-pointer shadow-[0_0_16px_-2px_rgba(96,165,250,0.35)] hover:border-blue-400/50 hover:shadow-[0_0_22px_-4px_rgba(96,165,250,0.55)]'
      )}
      onClick={() => isByteDance && setIsByteDanceRevealed((v) => !v)}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {/* Logo chip */}
        <div className="shrink-0 w-8 h-8 rounded-md bg-white border border-white/10 p-1 flex items-center justify-center overflow-hidden">
          <img
            src={logoUrl}
            alt={`${displayCompany} logo`}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title — full text, may wrap to a second line for long titles. */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <h3 className="font-semibold text-sm leading-tight text-foreground break-words">
              {item.title}
            </h3>
            {isCurrent && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Now
              </span>
            )}
            {isIntern && (
              <span
                className="shrink-0 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/5"
                title="Internship"
              >
                Internship
              </span>
            )}
          </div>

          {/* Company + date inline — no truncation */}
          <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5 text-xs text-foreground/70">
            <span className="break-words">{displayCompany}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
              {item.date}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground leading-snug mt-1 line-clamp-2">
            {item.description}
          </p>

          {/* Category pills */}
          {visibleCategories.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {visibleCategories.map((category) => {
                const style = categoryStyles[category];
                return (
                  <span
                    key={category}
                    className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border',
                      style.pill
                    )}
                  >
                    <span className={cn('w-1 h-1 rounded-full', style.dot)} />
                    {style.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TimelineItem;
