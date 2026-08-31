export const GITHUB_USERNAME = "BondeYash";

export const nav = [
  { href: "/", label: "Front Page", folio: "A1" },
  { href: "/edition", label: "The Edition", folio: "A2" },
  { href: "/about", label: "Profile", folio: "A3" },
  { href: "/work", label: "Technology", folio: "A5" },
  { href: "/experience", label: "Business", folio: "A7" },
  { href: "/contact", label: "Classifieds", folio: "A9" },
] as const;

/** Masthead furniture — the fixed print identity of the paper. */
export const paper = {
  title: "Yash Times",
  motto: "All the Code That's Fit to Ship",
  city: "Surat, Gujarat",
  volume: "Vol. MMXXVI",
  number: "No. 1",
  price: "Price: Free — Open Source",
  established: "Est. 2020",
  wire: "BONDE NEWS SERVICE",
} as const;

export const profile = {
  name: "Yash Bonde",
  fullName: "Yash Bonde",
  role: "Full Stack Engineer",
  location: "Surat, Gujarat, India",
  phone: "+91-8849552884",
  phoneHref: "tel:+918849552884",
  email: "yashbonde21@gmail.com",
  linkedin: "https://www.linkedin.com/in/gecdhd-comp-yash-bonde/",
  github: "https://github.com/BondeYash",
  resumeUrl: "https://drive.google.com/file/d/1aIwdwYyzvUBdUC-h9PuUvsfd-4Zunt4u/view?usp=sharing",
  website: "https://portfolio-24-vek0.onrender.com/",
  tagline: "Without me, the internet is just a bunch of 404s and a loading spinner.",
  /**
   * Headline alternatives. Swap `tagline` with any of these:
   * "Software that holds. Agents that earn their keep."
   * "Full-stack systems. Quietly ambitious."
   * "I put product, data, and models in the same conversation."
   * "APIs with manners. Interfaces with spine."
   */
  subheading:
    "Full-stack developer in Surat building healthcare AI, multi-tenant backends, and RAG pipelines. Node, Spring, and Next.js, with the tests to match.",
  bio: "I'm Yash Bonde, a full-stack developer in Surat. I completed my Bachelor of Engineering in Computer Engineering at Government Engineering College Dahod. I currently build an AI healthcare management product at Empiric Infotech. Before that I shipped Node.js and TypeScript services at Freshcodes. I care about systems that stay coherent under load: REST APIs, ledgers, agents, and the interfaces people actually use.",
  skillGroups: [
    {
      label: "Languages",
      items: ["Java", "TypeScript", "JavaScript", "Python", "Solidity", "SQL"],
    },
    {
      label: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "Spring Boot",
        "FastAPI",
        "REST APIs",
        "Microservices",
        "JWT",
        "RBAC",
      ],
    },
    {
      label: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
    },
    {
      label: "Data and AI",
      items: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "TypeORM",
        "JPA",
        "SQLAlchemy",
        "RAG",
        "LLM integration",
        "ChromaDB",
      ],
    },
    {
      label: "Cloud, DevOps, and Testing",
      items: [
        "Azure",
        "Docker",
        "GitHub Actions",
        "CI/CD",
        "Git",
        "Vitest",
        "Playwright",
        "Pytest",
      ],
    },
    {
      label: "Soft skills",
      items: [
        "Problem solving",
        "Technical communication",
        "Cross-functional collaboration",
        "Documentation",
        "Ownership",
        "Attention to detail",
      ],
    },
  ],
  education: [
    {
      school: "Government Engineering College Dahod",
      degree: "Bachelor of Engineering in Computer Engineering",
      detail: "CGPA: 8.57/10",
      duration: "Sep 2023 - 2026",
      location: "Dahod, India",
    },
    {
      school: "Shree K. J. Polytechnic Bharuch",
      degree: "Diploma in Computer Engineering",
      detail: "CGPA: 9.28/10",
      duration: "May 2020 - Aug 2023",
      location: "Bharuch, India",
    },
  ],
  experience: [
    {
      company: "Empiric Infotech",
      role: "Full Stack Engineer",
      duration: "April 2026 - Present",
      location: "Healthcare management AI application",
      bullets: [
        "Building an AI-based healthcare management application to organize client interactions and communication workflows.",
      ],
    },
    {
      company: "Freshcodes Technology",
      role: "Node.js Developer",
      duration: "Nov 2025 - March 2026",
      location: "Surat, Gujarat, India",
      bullets: [
        "Developed and maintained server-side applications and REST APIs using Node.js, Express.js, and TypeScript.",
        "Built microservice-based backend components and applied code-quality, testing, and deployment-automation practices for enterprise applications.",
      ],
    },
    {
      company: "Microsoft Azure Cloud Fundamentals Micro-Internship",
      role: "Cloud Training",
      duration: "Jul 2025",
      location: "Remote",
      bullets: [
        "Completed hands-on training covering Azure cloud services, virtual machines, and serverless computing.",
      ],
    },
  ],
  projects: [
    {
      name: "LinkedIn Content Automation Agent",
      period: "Jun 2026",
      stack:
        "Python, FastAPI, PostgreSQL, SQLAlchemy, ChromaDB, APScheduler, Groq/Ollama, Plotly",
      bullets: [
        "Built an automated pipeline that collects news from five sources, clusters and ranks trends with sentence embeddings and DBSCAN, and generates RAG-grounded LinkedIn drafts.",
        "Implemented JWT role-based approvals, guarded publishing through the official LinkedIn API, deduplication and fact-check gates, scheduled jobs, analytics feedback, and 74+ automated tests.",
      ],
    },
    {
      name: "BGen: Multi-Tenant Banking Platform",
      period: "Jun 2026",
      stack:
        "Java 21, Spring Boot 3.4, PostgreSQL, Spring Data JPA, Flyway, Spring Security, JWT",
      bullets: [
        "Built customer, account, transaction, and atomic money-transfer modules with deterministic lock ordering.",
        "Implemented an immutable double-entry ledger, reconciliation, JWT authentication, and method-level RBAC across read and write endpoints.",
      ],
    },
    {
      name: "BoilerBear: Developer Scaffolding Platform",
      period: "May 2026",
      stack:
        "TypeScript, Next.js 15, Turborepo, pnpm, Zod, Vitest, Playwright",
      bullets: [
        "Built a web UI and CLI that resolve stack manifests, detect dependency conflicts, encode plans in shareable URLs, and emit project-scaffolding commands.",
        "Expanded the registry to 112 manifests and four recipes; documented 59 unit tests, eight Playwright E2E specs, and 98.5% core coverage.",
      ],
    },
    {
      name: "Full-Stack Developer Portfolio",
      period: "2026",
      stack: "React, Node.js, Express.js, MongoDB, Framer Motion, Three.js",
      bullets: [
        "Launched an interactive, multi-theme portfolio with animated project showcases, backend integration, and a contact workflow.",
      ],
    },
  ],
  certifications: [
    "Microsoft Certified: Azure Fundamentals",
    "Java Spring Framework 6 with Spring Boot; Java Data Structures and Algorithms",
    "Ethereum and Solidity: The Complete Developer's Guide; Solana Blockchain Developer Program",
    "Docker SWARM Hands-on DevOps",
    "Dewang Mehta IT Awards 2025, College Topper",
    "CodeHawks Smart Contract Security CTF, Participant",
  ],
} as const;

export const skillKeywords = profile.skillGroups.flatMap((group) => [
  ...group.items,
]);
