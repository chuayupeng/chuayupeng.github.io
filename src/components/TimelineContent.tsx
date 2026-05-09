import React, { useMemo } from 'react';
import { Shield } from 'lucide-react';
import TimelineItem from '@/components/TimelineItem';
import { TimelineItemType, CategoryType } from '@/data/timelineData';

interface TimelineContentProps {
  filteredData: TimelineItemType[];
}

interface DatedItem extends TimelineItemType {
  // start/end are month-keys: year * 12 + (month - 1). Used for ordering
  // and for finding merge targets (so a role ending in March 2024 lands at
  // the right place even when another role started later in 2024).
  start: number;
  end: number;
  startYear: number;
  endYear: number;
  // startMonth / endMonth are inherited from TimelineItemType; they are also
  // used directly for placing the start dot and merge curve within a row.
  isCurrent: boolean;
  isPhantom?: boolean;
}

interface LaidOutItem extends DatedItem {
  rowIdx: number;
  topIdx: number;
  side: 1 | -1;
  depth: number;
}

type ParsedDates = {
  start: number;
  end: number;
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
  isCurrent: boolean;
};

const parseDates = (item: TimelineItemType): ParsedDates | null => {
  const startMonth = item.startMonth ?? 1;
  let endMonth = item.endMonth ?? 12;

  const m = item.date.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
  if (!m) {
    const single = item.date.match(/(\d{4})/);
    if (!single) return null;
    const y = parseInt(single[1], 10);
    return {
      startYear: y,
      endYear: y,
      startMonth,
      endMonth,
      start: y * 12 + (startMonth - 1),
      end: y * 12 + (endMonth - 1),
      isCurrent: false,
    };
  }

  const startYear = parseInt(m[1], 10);
  const isCurrent = /present/i.test(m[2]);
  const now = new Date();
  const endYear = isCurrent ? now.getFullYear() : parseInt(m[2], 10);
  if (isCurrent) endMonth = now.getMonth() + 1;

  return {
    startYear,
    endYear,
    startMonth,
    endMonth,
    start: startYear * 12 + (startMonth - 1),
    end: endYear * 12 + (endMonth - 1),
    isCurrent,
  };
};

const NOW_HEIGHT = 48;
const ROW_HEIGHT = 92;
const LANE_WIDTH = 28;
const EDGE_PAD = 16;
const YEAR_COL_WIDTH = 52;
const DOT_R = 5;
const CORNER_H = 14;
const MAIN_TAIL = 64;
// Minimum visible branch length so 2-3 month roles aren't reduced to a blip.
const MIN_BRANCH_H = Math.round(ROW_HEIGHT * 0.7);

const LANE_COLORS: Record<CategoryType, string> = {
  cybersecurity:    '#60a5fa',
  teaching:         '#34d399',
  'f&b':            '#fbbf24',
  entrepreneurship: '#c084fc',
};

const laneColorFor = (cat: CategoryType | CategoryType[]): string => {
  const arr = Array.isArray(cat) ? cat : [cat];
  const visible = arr.filter((c) => c !== 'teaching') as CategoryType[];
  return LANE_COLORS[visible[0] ?? arr[0]];
};

const TimelineContent: React.FC<TimelineContentProps> = ({ filteredData }) => {
  const data = useMemo(() => {
    const realItems: DatedItem[] = filteredData
      .map((it) => {
        const d = parseDates(it);
        return d ? { ...it, ...d } : null;
      })
      .filter((x): x is DatedItem => x !== null);

    if (realItems.length === 0) return null;

    // Phantom rows for end-only years — so a 2023-2025 entry actually lands
    // its merge at "2025" instead of at the nearest start year below it.
    const startYears = new Set(realItems.map((it) => it.startYear));
    const phantomYears: number[] = [];
    realItems.forEach((it) => {
      if (it.isCurrent) return; // ongoing roles merge at "Now", not at a year
      if (!startYears.has(it.endYear) && !phantomYears.includes(it.endYear)) {
        phantomYears.push(it.endYear);
      }
    });

    const phantomItems: DatedItem[] = phantomYears.map((year) => ({
      id: -year,
      title: '',
      date: `${year}`,
      description: '',
      category: 'cybersecurity',
      icon: 'Shield',
      coy: '',
      logo: '',
      startMonth: 1,
      endMonth: 12,
      startYear: year,
      endYear: year,
      // Phantom spans the whole year so any merge into this year finds it
      // as the topmost candidate row.
      start: year * 12,
      end: year * 12 + 11,
      isCurrent: false,
      isPhantom: true,
    }));

    // Sort by start desc — strict chronological order. Current roles are
    // visually highlighted via the glow effect, not by reshuffling rows.
    const items: DatedItem[] = [...realItems, ...phantomItems].sort(
      (a, b) => b.start - a.start || b.end - a.end || b.id - a.id
    );

    const enriched: LaidOutItem[] = items.map((role, rowIdx) => {
      let topIdx = rowIdx;
      for (let j = 0; j < items.length; j++) {
        if (items[j].start <= role.end) {
          topIdx = j;
          break;
        }
      }
      return { ...role, rowIdx, topIdx, side: 1 as 1 | -1, depth: 1 };
    });

    // Card display order: currents pinned to the top, then everything else
    // in chronological order. This is a separate index from rowIdx — the
    // graph (dots, branches, merges) keeps strict chronological positioning
    // while the cards re-order so "what I'm doing now" reads first.
    const realRowsChrono = enriched.filter((r) => !r.isPhantom);
    const cardOrder = [
      ...realRowsChrono.filter((r) => r.isCurrent),
      ...realRowsChrono.filter((r) => !r.isCurrent),
    ];
    const cardRowIdxById = new Map<number, number>();
    cardOrder.forEach((r, idx) => cardRowIdxById.set(r.id, idx));

    // Lane assignment skips phantoms (they have no branch). Side is decided
    // by the card's *display* index so the dot lands on the same side as the
    // card it belongs to. Lane packing inside the side still uses topIdx so
    // chronologically overlapping branches don't collide.
    const leftLaneEnds: number[] = [];
    const rightLaneEnds: number[] = [];
    enriched.forEach((r) => {
      if (r.isPhantom) return;
      const cardRow = cardRowIdxById.get(r.id) ?? r.rowIdx;
      r.side = cardRow % 2 === 0 ? 1 : -1;
      const lanes = r.side === 1 ? rightLaneEnds : leftLaneEnds;
      let lane = 0;
      while (lane < lanes.length && lanes[lane] >= r.topIdx) lane++;
      lanes[lane] = r.rowIdx;
      r.depth = lane + 1;
    });

    return {
      rows: enriched,
      cardOrder,
      cardRowIdxById,
      maxLeftDepth: Math.max(1, leftLaneEnds.length),
      maxRightDepth: Math.max(1, rightLaneEnds.length),
    };
  }, [filteredData]);

  if (!data) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-secondary border border-white/[0.06]">
          <Shield size={28} className="text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground mt-4 font-mono text-sm">
          No entries found for this filter.
        </p>
      </div>
    );
  }

  const { rows, cardOrder, cardRowIdxById, maxLeftDepth, maxRightDepth } = data;
  const cardYTop = (id: number, fallbackRowIdx: number) =>
    NOW_HEIGHT + (cardRowIdxById.get(id) ?? fallbackRowIdx) * ROW_HEIGHT;
  const cardYMid = (id: number, fallbackRowIdx: number) =>
    cardYTop(id, fallbackRowIdx) + ROW_HEIGHT / 2;
  const realRows = rows.filter((r) => !r.isPhantom);
  const totalRowsHeight = rows.length * ROW_HEIGHT;
  const totalHeight = NOW_HEIGHT + totalRowsHeight + MAIN_TAIL;

  const leftWidth = maxLeftDepth * LANE_WIDTH + EDGE_PAD;
  const rightWidth = maxRightDepth * LANE_WIDTH + EDGE_PAD;
  const graphWidth = leftWidth + rightWidth;
  const MAIN_X = leftWidth;

  // Terminal dots ARE the endpoints of the white line — keep them in lockstep.
  const yMainTop = NOW_HEIGHT / 2;
  const yMainBottom = totalHeight - 14;

  // Year axis labels — only show on year boundaries (months don't surface here).
  const yearChanges = rows.filter((r, i) => i === 0 || rows[i - 1].startYear !== r.startYear);

  return (
    <div className="relative mt-10">
      {/* Mobile: single-column list with year section headers. The graph
          metaphor doesn't fit narrow screens — readability wins. */}
      <div className="md:hidden space-y-2">
        {cardOrder.map((r, i) => {
          const prev = cardOrder[i - 1];
          const isYearChange = i === 0 || (prev && prev.startYear !== r.startYear);
          return (
            <React.Fragment key={r.id}>
              {isYearChange && (
                <div className="flex items-center gap-3 pt-3 first:pt-0">
                  <span className="font-mono text-sm tabular-nums font-semibold text-foreground/80">
                    {r.startYear}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
              )}
              <TimelineItem item={r} />
            </React.Fragment>
          );
        })}
      </div>

      {/* Desktop / tablet: bilateral git-style graph */}
      <div className="hidden md:flex items-stretch">
        {/* Year axis */}
        <div
          className="shrink-0 relative"
          style={{ width: YEAR_COL_WIDTH, height: totalHeight }}
          aria-hidden
        >
          <div
            className="absolute right-3 flex items-center justify-end"
            style={{ top: 0, height: NOW_HEIGHT }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyber-cyan">
              Now
            </span>
          </div>
          {yearChanges.map((r) => {
            const yCenter = NOW_HEIGHT + r.rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
            return (
              <div
                key={`y-${r.startYear}-${r.id}`}
                className="absolute right-3 font-mono text-sm tabular-nums font-medium text-foreground/80"
                style={{ top: yCenter, transform: 'translateY(-50%)' }}
              >
                {r.startYear}
              </div>
            );
          })}
        </div>

        {/* Left cards column */}
        <div className="flex-1 relative min-w-0" style={{ height: totalHeight }}>
          {realRows
            .filter((r) => r.side === -1)
            .map((r) => (
              <div
                key={r.id}
                className="absolute right-0 left-0 flex items-center justify-end pr-3 py-1"
                style={{ top: cardYTop(r.id, r.rowIdx), height: ROW_HEIGHT }}
              >
                <div className="w-full max-w-[26rem]">
                  <TimelineItem item={r} />
                </div>
              </div>
            ))}
        </div>

        {/* Graph */}
        <div
          className="shrink-0 relative"
          style={{ width: graphWidth, height: totalHeight }}
          aria-hidden
        >
          {/* NOW separator across the graph */}
          <div
            className="absolute left-0 right-0 border-t border-cyber-cyan/25"
            style={{ top: NOW_HEIGHT }}
          />

          <svg
            width={graphWidth}
            height={totalHeight}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Main line — solid white, terminating exactly at the glowing dots */}
            <line
              x1={MAIN_X}
              y1={yMainTop}
              x2={MAIN_X}
              y2={yMainBottom}
              stroke="white"
              strokeOpacity={0.85}
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Top terminal — "Now" / present, pulsing */}
            <g>
              <circle cx={MAIN_X} cy={yMainTop} r={10} fill="#64ffda" fillOpacity={0.12} />
              <circle cx={MAIN_X} cy={yMainTop} r={6} fill="#64ffda" fillOpacity={0.28} />
              <circle cx={MAIN_X} cy={yMainTop} r={4} fill="#64ffda">
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Bottom terminal — career origin, steady glow */}
            <g>
              <circle cx={MAIN_X} cy={yMainBottom} r={9} fill="white" fillOpacity={0.1} />
              <circle cx={MAIN_X} cy={yMainBottom} r={5.5} fill="white" fillOpacity={0.25} />
              <circle cx={MAIN_X} cy={yMainBottom} r={3.5} fill="white" fillOpacity={0.9} />
            </g>

            {/* Branches (skip phantom year rows — they exist only to anchor merges) */}
            {rows.filter((r) => !r.isPhantom).map((r) => {
              const sideSign = r.side;
              const xBranch = MAIN_X + sideSign * r.depth * LANE_WIDTH;

              // Two month-to-y mappings, both centered on the row's middle:
              //  - SMALL swing for yStart so the visible branch *length* is
              //    driven by row-count (a 4-year role ≈ 2× a 2-year role).
              //  - WIDER (but still bounded) swing for yMerge so two roles
              //    ending in different months of the same year (e.g. Jan vs
              //    Apr 2025) land at distinct y on main, while keeping the
              //    same uniform CORNER_H curl-in shape across all branches.
              const SMALL_MONTH_AMP = 10;
              const MERGE_MONTH_AMP = ROW_HEIGHT * 0.5;
              const monthOffsetSmall = (m: number) =>
                ROW_HEIGHT / 2 + ((6.5 - m) / 12) * SMALL_MONTH_AMP;
              const monthOffsetMerge = (m: number) =>
                ROW_HEIGHT / 2 + ((6.5 - m) / 12) * MERGE_MONTH_AMP;
              // Tiny id-based jitter so two same-year same-month merges don't perfectly stack.
              const tieJitter = ((r.id * 19) % 9) - 4; // -4..+4

              const yStart =
                NOW_HEIGHT + r.rowIdx * ROW_HEIGHT + monthOffsetSmall(r.startMonth) + tieJitter;
              // Leader anchors at the card's actual y, which may be far from
              // the chronological row when currents are pinned to the top.
              const yMid = cardYMid(r.id, r.rowIdx);

              // Current roles merge straight into the glowing "Now" terminal so
              // the line never overshoots present time.
              let yMerge = r.isCurrent
                ? yMainTop
                : NOW_HEIGHT + r.topIdx * ROW_HEIGHT + monthOffsetMerge(r.endMonth) + tieJitter;

              // Short experiences would otherwise render as a tiny blip —
              // clamp the visible span so every branch is at least MIN_BRANCH_H.
              if (!r.isCurrent && yStart - yMerge < MIN_BRANCH_H) {
                yMerge = yStart - MIN_BRANCH_H;
              }

              const color = laneColorFor(r.category);

              // Same uniform CORNER_H curl-in for every branch — vertical line
              // ends CORNER_H above the merge, then a tight curve to main.
              const yStraightTop = yMerge + CORNER_H;
              const mergePath =
                `M ${xBranch} ${yMerge + CORNER_H} ` +
                `C ${xBranch} ${yMerge}, ${MAIN_X} ${yMerge + CORNER_H}, ${MAIN_X} ${yMerge}`;

              const leaderEndX = sideSign === 1 ? graphWidth : 0;

              return (
                <g key={r.id}>
                  <line
                    x1={leaderEndX}
                    y1={yMid}
                    x2={xBranch}
                    y2={yStart}
                    stroke={color}
                    strokeOpacity={0.45}
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    strokeLinecap="round"
                  />
                  {/* Glow under current-role branches so they read as "live" */}
                  {r.isCurrent && (
                    <>
                      <line
                        x1={xBranch}
                        y1={yStart}
                        x2={xBranch}
                        y2={yStraightTop}
                        stroke={color}
                        strokeOpacity={0.18}
                        strokeWidth={9}
                        strokeLinecap="round"
                      />
                      <path
                        d={mergePath}
                        fill="none"
                        stroke={color}
                        strokeOpacity={0.18}
                        strokeWidth={9}
                        strokeLinecap="round"
                      />
                      <circle cx={xBranch} cy={yStart} r={12} fill={color} fillOpacity={0.1} />
                      <circle cx={xBranch} cy={yStart} r={8} fill={color} fillOpacity={0.22} />
                    </>
                  )}
                  <line
                    x1={xBranch}
                    y1={yStart}
                    x2={xBranch}
                    y2={yStraightTop}
                    stroke={color}
                    strokeOpacity={0.9}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d={mergePath}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.9}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={xBranch}
                    cy={yStart}
                    r={DOT_R}
                    fill={color}
                    stroke="hsl(222 47% 5%)"
                    strokeWidth={1.5}
                  >
                    {r.isCurrent && (
                      <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right cards column */}
        <div className="flex-1 relative min-w-0" style={{ height: totalHeight }}>
          {realRows
            .filter((r) => r.side === 1)
            .map((r) => (
              <div
                key={r.id}
                className="absolute left-0 right-0 flex items-center justify-start pl-3 py-1"
                style={{ top: cardYTop(r.id, r.rowIdx), height: ROW_HEIGHT }}
              >
                <div className="w-full max-w-[26rem]">
                  <TimelineItem item={r} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineContent;
