import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-accent/15 bg-panel/40 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-site flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <p className="type-label text-muted">
          © {year} {profile.fullName}
        </p>
        <ul className="flex items-center gap-3">
          <li>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 text-accent transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              <Mail size={15} />
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 text-accent transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              <Github size={15} />
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 text-accent transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              <Linkedin size={15} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
