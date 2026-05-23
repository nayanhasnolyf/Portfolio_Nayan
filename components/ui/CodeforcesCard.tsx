import { getCodeforcesStats, type CodeforcesStats } from '@/lib/codeforcesStats';

const rankColorClassNames: Record<string, string> = {
  newbie: 'codeforces-rank-newbie',
  pupil: 'codeforces-rank-pupil',
  specialist: 'codeforces-rank-specialist',
  expert: 'codeforces-rank-expert',
  'candidate master': 'codeforces-rank-candidate-master',
  master: 'codeforces-rank-master',
  'international master': 'codeforces-rank-master',
  grandmaster: 'codeforces-rank-grandmaster',
  'international grandmaster': 'codeforces-rank-grandmaster',
  'legendary grandmaster': 'codeforces-rank-grandmaster',
};

function getRankColorClass(rank: string) {
  return rankColorClassNames[rank.toLowerCase()] ?? 'codeforces-rank-newbie';
}

function buildSparklinePath(history: CodeforcesStats['ratingHistory']) {
  if (!history.length) {
    return '';
  }

  const width = 220;
  const height = 76;
  const ratings = history.map((item) => item.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const ratingRange = Math.max(maxRating - minRating, 1);
  const xStep = history.length > 1 ? width / (history.length - 1) : width;

  return history
    .map((item, index) => {
      const x = index * xStep;
      const y = height - ((item.rating - minRating) / ratingRange) * height;

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function CodeforcesFallback() {
  return (
    <div className="reveal-child codeforces-card rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="codeforces-card-header">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10 text-sm font-semibold text-cyan-100/85"
            aria-hidden="true"
          >
            &lt;/&gt;
          </span>
          <p className="section-label font-semibold">Competitive Programming</p>
        </div>
        <span className="codeforces-source">Codeforces</span>
      </div>
      <div className="codeforces-skeleton">
        <span className="rounded-xl border border-white/10 bg-white/5" />
        <span className="rounded-xl border border-white/10 bg-white/5" />
        <span className="rounded-xl border border-white/10 bg-white/5" />
      </div>
      <p className="codeforces-fallback-copy">
        Codeforces stats are temporarily unavailable.
      </p>
    </div>
  );
}

export async function CodeforcesCard() {
  const stats = await getCodeforcesStats();

  if (!stats) {
    return <CodeforcesFallback />;
  }

  const rankColorClassName = getRankColorClass(stats.rank);
  const sparklinePath = buildSparklinePath(stats.ratingHistory);

  return (
    <div className="reveal-child codeforces-card rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="codeforces-card-header">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10 text-sm font-semibold text-cyan-100/85"
            aria-hidden="true"
          >
            &lt;/&gt;
          </span>
          <p className="section-label font-semibold">Competitive Programming</p>
        </div>
        <span className="codeforces-source">Codeforces</span>
      </div>

      <div className="codeforces-card-main">
        <div>
          <p className="codeforces-handle">@{stats.handle}</p>
          <p className="codeforces-rating-label">Codeforces Rating</p>
          <p className={`codeforces-rating ${rankColorClassName}`}>
            {stats.currentRating ?? 'Unrated'}
          </p>
          <p className="codeforces-max-rank">Peak rank: {stats.maxRank}</p>
        </div>

        <div className="codeforces-sparkline" aria-label="Last 10 Codeforces contest ratings">
          {sparklinePath ? (
            <svg viewBox="0 0 220 80" role="img">
              <path className="codeforces-sparkline-line" d={sparklinePath} />
            </svg>
          ) : (
            <p>No rated contests yet</p>
          )}
        </div>
      </div>

      <div className="codeforces-stat-pills">
        <span className="rounded-xl border border-white/10 bg-white/5">
          <strong>{stats.contestsEntered}</strong>
          Contests
        </span>
        <span className="rounded-xl border border-white/10 bg-white/5">
          <strong>{stats.maxRating ?? 'N/A'}</strong>
          Peak rating
        </span>
        <span className="rounded-xl border border-white/10 bg-white/5">
          <strong>{stats.rank}</strong>
          CF Rank
        </span>
      </div>
    </div>
  );
}
