const CODEFORCES_REVALIDATE_SECONDS = 60 * 60;
const CODEFORCES_HANDLE = 'Nayan_Pokhriyal';

type CodeforcesResponse<T> = {
  status: 'OK' | 'FAILED';
  result?: T;
};

type CodeforcesUser = {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
};

type CodeforcesRatingChange = {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
};

export type CodeforcesStats = {
  handle: string;
  currentRating: number | null;
  maxRating: number | null;
  rank: string;
  maxRank: string;
  contestsEntered: number;
  ratingHistory: Array<{
    contestId: number;
    contestName: string;
    rating: number;
  }>;
};

async function fetchCodeforces<T>(url: string) {
  const response = await fetch(url, {
    next: { revalidate: CODEFORCES_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error('Codeforces API request failed');
  }

  const data = (await response.json()) as CodeforcesResponse<T>;

  if (data.status !== 'OK' || !data.result) {
    throw new Error('Codeforces API returned a failed status');
  }

  return data.result;
}

export async function getCodeforcesStats(handle = CODEFORCES_HANDLE): Promise<CodeforcesStats | null> {
  try {
    const encodedHandle = encodeURIComponent(handle);
    const [users, ratingChanges] = await Promise.all([
      fetchCodeforces<CodeforcesUser[]>(
        `https://codeforces.com/api/user.info?handles=${encodedHandle}`,
      ),
      fetchCodeforces<CodeforcesRatingChange[]>(
        `https://codeforces.com/api/user.rating?handle=${encodedHandle}`,
      ),
    ]);

    const user = users[0];

    if (!user) {
      return null;
    }

    return {
      handle: user.handle,
      currentRating: user.rating ?? null,
      maxRating: user.maxRating ?? null,
      rank: user.rank ?? 'unrated',
      maxRank: user.maxRank ?? 'unrated',
      contestsEntered: ratingChanges.length,
      ratingHistory: ratingChanges.slice(-10).map((change) => ({
        contestId: change.contestId,
        contestName: change.contestName,
        rating: change.newRating,
      })),
    };
  } catch {
    return null;
  }
}
