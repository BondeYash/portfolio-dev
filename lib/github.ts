import { fallbackProfile, fallbackRepos } from "@/data/fallback-github";
import { GITHUB_USERNAME } from "@/data/profile";
import type { GithubPayload, GithubProfile, GithubRepo } from "@/lib/types";

const REVALIDATE_SECONDS = 60 * 60 * 12;

type GithubUserResponse = {
  name: string | null;
  login: string;
  bio: string | null;
  avatar_url: string;
  followers: number;
  location: string | null;
  html_url: string;
  public_repos: number;
};

type GithubRepoResponse = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
  fork: boolean;
};

async function githubGet<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "yash-bonde-portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

function mapProfile(user: GithubUserResponse): GithubProfile {
  return {
    name: user.name ?? user.login,
    login: user.login,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    followers: user.followers,
    location: user.location,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
  };
}

function selectTopRepos(repos: GithubRepoResponse[]): GithubRepo[] {
  return repos
    .filter((repo) => !repo.fork && repo.name !== GITHUB_USERNAME)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    })
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
    }));
}

export async function getGithubPortfolio(): Promise<GithubPayload> {
  try {
    const [user, repos] = await Promise.all([
      githubGet<GithubUserResponse>(`/users/${GITHUB_USERNAME}`),
      githubGet<GithubRepoResponse[]>(
        `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      ),
    ]);

    return {
      profile: mapProfile(user),
      repos: selectTopRepos(repos),
      source: "live",
    };
  } catch {
    return {
      profile: fallbackProfile,
      repos: fallbackRepos,
      source: "fallback",
    };
  }
}
