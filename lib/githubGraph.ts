const GITHUB_GRAPH_REVALIDATE_SECONDS = 60 * 60;
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_USERNAME = 'nayanhasnolyf';

export type GitHubContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubContributionGraph = {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
};

type GitHubGraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: GitHubContributionGraph;
      };
    };
  };
  errors?: Array<{ message: string }>;
};

const contributionCalendarQuery = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export async function getGitHubContributionGraph() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: contributionCalendarQuery,
        variables: { login: GITHUB_USERNAME },
      }),
      next: { revalidate: GITHUB_GRAPH_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as GitHubGraphQLResponse;

    if (payload.errors?.length) {
      return null;
    }

    return payload.data?.user?.contributionsCollection?.contributionCalendar ?? null;
  } catch {
    return null;
  }
}
