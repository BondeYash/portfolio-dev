import { GITHUB_USERNAME } from "@/data/profile";
import type { GithubProfile, GithubRepo } from "@/lib/types";

export const fallbackProfile: GithubProfile = {
  name: "Yash Sanjay Bonde",
  login: GITHUB_USERNAME,
  bio: "An MERN Stack Engineer. Love to learn new things and explore new tech daily",
  avatarUrl: "https://avatars.githubusercontent.com/u/103805387?v=4",
  followers: 3,
  location: "Surat Gujarat",
  htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
  publicRepos: 45,
};

export const fallbackRepos: GithubRepo[] = [
  {
    name: "Airdrop_hunter",
    description: "This is an Ai bot to Generate Airdrop in Blockchain",
    language: null,
    stars: 23,
    updatedAt: "2026-06-30T12:02:42Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/Airdrop_hunter`,
  },
  {
    name: "Full-Stack-Weather-App",
    description:
      "Full stack weather app built with HTML, CSS, and vanilla JavaScript.",
    language: "HTML",
    stars: 23,
    updatedAt: "2026-06-30T12:02:42Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/Full-Stack-Weather-App`,
  },
  {
    name: "thunder-loan-audit",
    description: "A practice audit file",
    language: "Solidity",
    stars: 22,
    updatedAt: "2026-06-30T12:02:52Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/thunder-loan-audit`,
  },
  {
    name: "tswap-audit-by-yash",
    description: "A practice audit done by me",
    language: "Solidity",
    stars: 22,
    updatedAt: "2026-06-30T12:02:52Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/tswap-audit-by-yash`,
  },
  {
    name: "4-puppy-raffle-audit",
    description: "This is a practice audit done by me",
    language: "Solidity",
    stars: 22,
    updatedAt: "2026-06-30T12:02:51Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/4-puppy-raffle-audit`,
  },
  {
    name: "NftUsingFoundry",
    description: "A basic NFT project built with Foundry.",
    language: "Solidity",
    stars: 22,
    updatedAt: "2026-06-30T12:02:45Z",
    htmlUrl: `https://github.com/${GITHUB_USERNAME}/NftUsingFoundry`,
  },
];
