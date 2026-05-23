'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { GitHubContributionDay, GitHubContributionWeek } from '@/lib/githubGraph';

const WEEK_COUNT = 53;
const DAYS_PER_WEEK = 7;
const CELL_GAP = 3;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type GitHubGraphGridProps = {
  weeks: GitHubContributionWeek[];
};

type TooltipState = {
  label: string;
  left: number;
  top: number;
} | null;

function getContributionClass(count: number) {
  if (count >= 10) {
    return 'github-graph-cell github-graph-cell-level-4';
  }

  if (count >= 6) {
    return 'github-graph-cell github-graph-cell-level-3';
  }

  if (count >= 3) {
    return 'github-graph-cell github-graph-cell-level-2';
  }

  if (count >= 1) {
    return 'github-graph-cell github-graph-cell-level-1';
  }

  return 'github-graph-cell github-graph-cell-empty';
}

function normalizeWeeks(weeks: GitHubContributionWeek[]) {
  return Array.from({ length: WEEK_COUNT }, (_, weekIndex) => {
    const week = weeks[weekIndex];

    return Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => {
      return (
        week?.contributionDays[dayIndex] ?? {
          date: '',
          contributionCount: 0,
          color: '',
        }
      );
    });
  });
}

function getMonthLabels(weeks: GitHubContributionDay[][]) {
  const labels: Array<{ label: string; column: number }> = [];
  let previousMonth = '';

  weeks.forEach((week, weekIndex) => {
    week.forEach((day) => {
      if (!day.date) {
        return;
      }

      const date = new Date(`${day.date}T00:00:00`);
      const month = `${date.getFullYear()}-${date.getMonth()}`;

      if (month !== previousMonth) {
        labels.push({
          label: MONTH_LABELS[date.getMonth()],
          column: weekIndex + 1,
        });
        previousMonth = month;
      }
    });
  });

  return labels;
}

function formatTooltip(day: GitHubContributionDay) {
  const commits = day.contributionCount === 1 ? 'commit' : 'commits';
  return `${day.date} · ${day.contributionCount} ${commits}`;
}

export function GitHubGraphGrid({ weeks }: GitHubGraphGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(10);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const normalizedWeeks = useMemo(() => normalizeWeeks(weeks), [weeks]);
  const monthLabels = useMemo(() => getMonthLabels(normalizedWeeks), [normalizedWeeks]);
  const graphStyle = {
    '--github-cell-size': `${cellSize}px`,
  } as CSSProperties;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const updateCellSize = () => {
      const containerWidth = container.clientWidth;
      const nextCellSize = Math.max(3, Math.floor((containerWidth - (52 * CELL_GAP)) / WEEK_COUNT));
      setCellSize(nextCellSize);
    };

    updateCellSize();

    const observer = new ResizeObserver(updateCellSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="github-graph-grid-wrap" style={graphStyle}>
      <div className="github-graph-months" aria-hidden="true">
        {monthLabels.map((month) => (
          <span
            key={`${month.label}-${month.column}`}
            style={{ gridColumn: month.column }}
          >
            {month.label}
          </span>
        ))}
      </div>
      <div
        className="github-graph-grid"
        aria-label="GitHub contribution activity graph"
        role="img"
      >
        {normalizedWeeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <span
              key={`${weekIndex}-${dayIndex}-${day.date || 'empty'}`}
              className={getContributionClass(day.contributionCount)}
              style={{
                gridColumn: weekIndex + 1,
                gridRow: dayIndex + 1,
              }}
              onMouseEnter={(event) => {
                if (day.contributionCount <= 0) {
                  return;
                }

                const target = event.currentTarget;
                setTooltip({
                  label: formatTooltip(day),
                  left: target.offsetLeft + target.offsetWidth / 2,
                  top: target.offsetTop,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              onFocus={(event) => {
                if (day.contributionCount <= 0) {
                  return;
                }

                const target = event.currentTarget;
                setTooltip({
                  label: formatTooltip(day),
                  left: target.offsetLeft + target.offsetWidth / 2,
                  top: target.offsetTop,
                });
              }}
              onBlur={() => setTooltip(null)}
              tabIndex={day.contributionCount > 0 ? 0 : -1}
            />
          )),
        )}
      </div>
      {tooltip ? (
        <span
          className="github-graph-tooltip"
          style={{
            left: tooltip.left,
            top: tooltip.top,
          }}
        >
          {tooltip.label}
        </span>
      ) : null}
    </div>
  );
}
