export type GithubProfile = {
  name: string;
  login: string;
  bio: string | null;
  avatarUrl: string;
  followers: number;
  location: string | null;
  htmlUrl: string;
  publicRepos: number;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  htmlUrl: string;
};

export type GithubPayload = {
  profile: GithubProfile;
  repos: GithubRepo[];
  source: "live" | "fallback";
};
