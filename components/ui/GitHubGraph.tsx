import { GitGraph } from 'lucide-react';
import { GitHubGraphGrid } from '@/components/ui/GitHubGraphGrid';
import { getGitHubContributionGraph } from '@/lib/githubGraph';

export async function GitHubGraph() {
  const graph = await getGitHubContributionGraph();

  return (
    <div className="glass-panel github-graph-panel reveal-child">
      <div className="github-graph-header">
        <GitGraph size={12} aria-hidden="true" />
        <p className="section-label font-semibold">Contribution Activity</p>
      </div>

      {graph ? (
        <GitHubGraphGrid weeks={graph.weeks} />
      ) : (
        <p className="github-graph-fallback">
          Contribution activity unavailable. Add GITHUB_TOKEN in Vercel environment variables and redeploy.
        </p>
      )}

      <p className="github-graph-caption">
        Commit history, last 12 months.
      </p>
    </div>
  );
}
