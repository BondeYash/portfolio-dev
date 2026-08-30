export const GITHUB_USERNAME = "BondeYash";

export const profile = {
  name: "Yash",
  fullName: "Yash Sanjay Bonde",
  role: "Full Stack Engineer",
  location: "Surat Gujarat India",
  email: "yashbonde21@gmail.com",
  linkedin: "https://www.linkedin.com/in/gecdhd-comp-yash-bonde/",
  github: "https://github.com/BondeYash",
  resumeUrl: "https://drive.google.com/drive/home",
  tagline: "Full-stack by craft. On-chain by curiosity.",
  /**
   * Headline alternatives — swap `tagline` with any of these:
   * "Interfaces people use. Contracts people trust."
   * "MERN in production. Solidity under pressure."
   * "Ships the product. Then audits the protocol."
   * "From Surat. Building software that doesn't flinch."
   */
  subheading:
    "MERN engineer in Surat shipping production apps, Foundry contracts, and the audits that keep them honest.",
  bio: "I'm a full-stack engineer from Surat who lives in the MERN stack and keeps drifting toward the chain. I build product surfaces people actually use — then drop into Foundry, Hardhat, and Solidity when the protocol needs to hold. Always learning, always shipping, slightly allergic to filler.",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Express",
    "Solidity",
    "Foundry",
    "Hardhat",
    "Truffle",
    "JavaScript",
    "Python",
    "Docker",
    "Firebase",
    "AWS",
    "Git",
  ],
  experience: [
    {
      company: "[COMPANY]",
      role: "[ROLE]",
      duration: "[e.g. Jan 2023 – Present]",
      description: "[what you did / impact]",
    },
  ],
  education: [
    { school: "[SCHOOL]", degree: "[DEGREE]", year: "[YEAR]" },
  ],
} as const;

export type Profile = typeof profile;
export type Experience = (typeof profile.experience)[number];
export type Education = (typeof profile.education)[number];
