import { projects as fallbackProjects } from '@/lib/content';

export type RankedProject = {
  rank: number;
  score: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  repoUrl: string;
  liveUrl?: string;
  status: string;
};

type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
};

type ProjectOverride = Partial<Omit<RankedProject, 'rank'>> & {
  priority?: number;
};

const GITHUB_REVALIDATE_SECONDS = 60 * 60;
const OWNED_REPOS_URL = 'https://api.github.com/users/nayanhasnolyf/repos?per_page=100&sort=updated';
const COLLAB_REPO_URLS = ['https://api.github.com/repos/Yash07-pixel/molgenix'];

const projectOverrides: Record<string, ProjectOverride> = {
  'nayanhasnolyf/Spndx---financial-dashboard-workspace': {
    priority: 1,
    score: 'A+',
    title: 'Spndx',
    category: 'Full-Stack Financial Dashboard',
    description:
      'The strongest portfolio project: a deployed full-stack financial dashboard with role-based controls, transaction CRUD, analytics, Recharts visualisations, 11-language support, and a Gemini-powered financial assistant.',
    details: ['React/Vite', 'Express', 'PostgreSQL', 'Gemini API'],
    liveUrl: 'https://spndx-financial-dashboard-workspace.vercel.app',
    status: 'Featured',
  },
  'Yash07-pixel/molgenix': {
    priority: 2,
    score: 'A',
    title: 'MolGenix',
    category: 'AI Drug Discovery Backend',
    description:
      'A high-value collaboration project: an AI-powered drug discovery backend where researchers describe a disease target and the system scaffolds molecule generation, screening, ADMET prediction, docking, vector search, and report generation.',
    details: ['FastAPI', 'PostgreSQL', 'RDKit', 'DeepChem'],
    status: 'Featured collaboration',
  },
  'nayanhasnolyf/RISC-V-Systolic-Array-Accelerator': {
    priority: 3,
    score: 'A',
    title: 'RISC-V Systolic Array Accelerator',
    category: 'Hardware / Verilog Accelerator',
    description:
      'A high-signal engineering project: a 4x4 output-stationary systolic array accelerator in synthesizable Verilog with reusable RTL blocks, MMIO bridge, testbenches, and waveform verification.',
    details: ['Verilog', 'RISC-V', 'MMIO', 'Iverilog'],
    status: 'Featured',
  },
  'nayanhasnolyf/multi-agent-legal-mediation-ai': {
    priority: 4,
    score: 'A-',
    title: 'Multi-Agent Legal Mediation AI',
    category: 'TypeScript AI Product Prototype',
    description:
      'A focused TypeScript/Vite application with component, context, service, and type layers for a multi-agent legal mediation experience. Strong product direction, but would benefit from a README.',
    details: ['TypeScript', 'Vite', 'React', 'AI UX'],
    status: 'Featured',
  },
  'nayanhasnolyf/Reseach-Crew': {
    priority: 5,
    score: 'B+',
    title: 'Research Crew',
    category: 'CrewAI Research Workflow',
    description:
      'A multi-agent research workflow using CrewAI with researcher and reporting analyst agents that collaborate to generate structured reports.',
    details: ['Python', 'CrewAI', 'Agents', 'Reports'],
    status: 'Strong',
  },
  'nayanhasnolyf/Multi-Agent-Cold-Email-Generator-Sender': {
    priority: 6,
    score: 'B+',
    title: 'Multi-Agent Cold Email Generator Sender',
    category: 'Agentic Sales Automation',
    description:
      'A multi-agent orchestration system that generates, formats, and sends cold sales emails using Google Gemini API via an OpenAI-compatible client and SendGrid.',
    details: ['Python', 'Gemini API', 'SendGrid', 'Agents'],
    status: 'Strong',
  },
  'nayanhasnolyf/Career-Conversations-Chatbox': {
    priority: 7,
    score: 'B',
    title: 'Career Conversations Chatbox',
    category: 'AI Personal Assistant',
    details: ['Python', 'AI Assistant', 'Lead Alerts'],
    status: 'Promising',
  },
  'nayanhasnolyf/nayaai': {
    priority: 8,
    score: 'B-',
    title: 'Nayaai',
    category: 'CrewAI Agent Template',
    description:
      'A CrewAI-based multi-agent setup with configurable agents and tasks. Useful AI systems practice, though the README still reads close to the starter template.',
    details: ['Python', 'CrewAI', 'uv', 'Agents'],
    status: 'Improve README',
  },
  'nayanhasnolyf/Jojen-AI': {
    priority: 9,
    score: 'C+',
    title: 'Jojen AI',
    category: 'Gemini + Gradio Chat Assistant',
    details: ['Python', 'Gemini Pro', 'Gradio'],
    status: 'Utility',
  },
  'nayanhasnolyf/Gemini-Chatbox': {
    priority: 10,
    score: 'C+',
    title: 'Gemini Chatbox',
    category: 'Terminal AI Utility',
    details: ['Python', 'Gemini SDK', 'CLI'],
    status: 'Utility',
  },
  'nayanhasnolyf/TicTacToe-Game-Using-MINMAX-AI': {
    priority: 11,
    score: 'C',
    title: 'TicTacToe Game Using Minimax AI',
    category: 'DSA / Java AI Exercise',
    details: ['Java', 'Minimax', 'DSA'],
    status: 'Learning',
  },
  'nayanhasnolyf/test': {
    priority: 98,
    score: 'D',
    status: 'Archive',
  },
  'nayanhasnolyf/Java-Script': {
    priority: 97,
    score: 'D',
    status: 'Archive',
  },
};

export async function getRankedProjects(): Promise<RankedProject[]> {
  try {
    const repos = await fetchGitHubRepos();
    return rankProjects(repos);
  } catch {
    return fallbackProjects;
  }
}

async function fetchGitHubRepos() {
  const ownedResponse = await fetch(OWNED_REPOS_URL, {
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!ownedResponse.ok) {
    throw new Error('Unable to fetch owned GitHub repositories');
  }

  const ownedRepos = (await ownedResponse.json()) as GitHubRepo[];
  const collaborationRepos = await Promise.all(
    COLLAB_REPO_URLS.map(async (url) => {
      const response = await fetch(url, {
        next: { revalidate: GITHUB_REVALIDATE_SECONDS },
        headers: {
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as GitHubRepo;
    }),
  );

  return [...ownedRepos, ...collaborationRepos.filter((repo): repo is GitHubRepo => Boolean(repo))]
    .filter((repo) => !repo.fork && !repo.archived)
    .filter(uniqueByFullName);
}

function uniqueByFullName(repo: GitHubRepo, index: number, repos: GitHubRepo[]) {
  return repos.findIndex((candidate) => candidate.full_name === repo.full_name) === index;
}

function rankProjects(repos: GitHubRepo[]) {
  return repos
    .map((repo) => {
      const override = projectOverrides[repo.full_name] ?? {};
      const project = toRankedProject(repo, override);

      return {
        project,
        priority: override.priority ?? 50,
        autoScore: getAutoScore(repo),
      };
    })
    .sort((a, b) => a.priority - b.priority || b.autoScore - a.autoScore)
    .map(({ project }, index) => ({
      ...project,
      rank: index + 1,
    }));
}

function toRankedProject(repo: GitHubRepo, override: ProjectOverride): RankedProject {
  const title = override.title ?? humanizeRepoName(repo.name);
  const score = override.score ?? scoreFromAutoScore(getAutoScore(repo));

  return {
    rank: 0,
    score,
    title,
    category: override.category ?? inferCategory(repo),
    description:
      override.description ??
      repo.description ??
      'A public GitHub project. Add a strong README and description to make this easier to evaluate and feature.',
    details: override.details ?? inferDetails(repo),
    repoUrl: override.repoUrl ?? repo.html_url,
    liveUrl: override.liveUrl ?? normalizeHomepage(repo.homepage),
    status: override.status ?? statusFromScore(score),
  };
}

function getAutoScore(repo: GitHubRepo) {
  const hasDescription = repo.description ? 18 : 0;
  const hasHomepage = normalizeHomepage(repo.homepage) ? 18 : 0;
  const languageScore = repo.language ? 10 : 0;
  const sizeScore = Math.min(Math.log10(Math.max(repo.size, 1)) * 12, 28);
  const starScore = Math.min(repo.stargazers_count * 3, 9);
  const forkScore = Math.min(repo.forks_count * 2, 6);
  const recencyScore = getRecencyScore(repo.pushed_at);
  const penalty = /(^test$|java-script$)/i.test(repo.name) ? 36 : 0;

  return hasDescription + hasHomepage + languageScore + sizeScore + starScore + forkScore + recencyScore - penalty;
}

function getRecencyScore(date: string) {
  const pushedAt = new Date(date).getTime();
  const now = Date.now();
  const ageDays = Math.max((now - pushedAt) / 86_400_000, 0);

  if (ageDays < 30) return 10;
  if (ageDays < 120) return 7;
  if (ageDays < 365) return 4;
  return 1;
}

function scoreFromAutoScore(score: number) {
  if (score >= 72) return 'A-';
  if (score >= 58) return 'B+';
  if (score >= 46) return 'B';
  if (score >= 34) return 'C+';
  if (score >= 22) return 'C';
  return 'D';
}

function statusFromScore(score: string) {
  if (score.startsWith('A')) return 'Featured';
  if (score === 'B+' || score === 'B') return 'Strong';
  if (score === 'C+' || score === 'C') return 'Learning';
  return 'Needs docs';
}

function inferCategory(repo: GitHubRepo) {
  const name = repo.name.toLowerCase();
  const description = repo.description?.toLowerCase() ?? '';

  if (name.includes('agent') || description.includes('agent')) return 'Agentic AI Project';
  if (name.includes('chat') || description.includes('chat')) return 'AI Chat Utility';
  if (name.includes('dashboard') || description.includes('dashboard')) return 'Full-Stack Dashboard';
  if (repo.language === 'Verilog') return 'Hardware / RTL Project';
  if (repo.language === 'Java') return 'Java / DSA Project';
  if (repo.language === 'TypeScript') return 'TypeScript Product Prototype';
  if (repo.language === 'Python') return 'Python AI Project';
  return 'Public GitHub Project';
}

function inferDetails(repo: GitHubRepo) {
  const details = new Set<string>();

  if (repo.language) details.add(repo.language);
  if (repo.homepage) details.add('Live');
  if (/agent|crew/i.test(repo.name + repo.description)) details.add('Agents');
  if (/gemini/i.test(repo.name + repo.description)) details.add('Gemini');
  if (/dashboard|react|vite/i.test(repo.name + repo.description)) details.add('Frontend');
  if (/docker|backend|api/i.test(repo.name + repo.description)) details.add('Backend');

  return Array.from(details).slice(0, 4);
}

function humanizeRepoName(name: string) {
  return name
    .replace(/---/g, ' ')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeHomepage(homepage: string | null) {
  if (!homepage) return undefined;
  return homepage.trim() || undefined;
}
