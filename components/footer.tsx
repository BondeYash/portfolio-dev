import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/10 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-site flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          © {year} {profile.fullName}. Built with Next.js.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/15 text-ink transition-colors hover:border-accent/50"
            >
              <Mail size={16} />
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/15 text-ink transition-colors hover:border-accent/50"
            >
              <Github size={16} />
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/15 text-ink transition-colors hover:border-accent/50"
            >
              <Linkedin size={16} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
