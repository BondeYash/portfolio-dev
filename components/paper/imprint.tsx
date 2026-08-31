import { paper, profile } from "@/data/profile";

/**
 * The imprint every paper sets in agate at the foot of the sheet:
 * who printed it, where, and how to reach the desk. Not a site footer.
 */
export function Imprint() {
  const year = new Date().getFullYear();

  return (
    <section className="mt-8 border-t-2 border-rule pt-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="slug">
          {paper.title} &middot; {paper.volume} &middot; {paper.number} &middot;{" "}
          {paper.established}
        </p>
        <p className="slug">
          Published daily from {paper.city} &middot; {paper.price}
        </p>
      </div>

      <p className="prose-col mt-1.5 !text-left !text-[0.78rem] !leading-[1.4] text-faded">
        Composed in Next.js and set in Playfair Display, Source Serif and
        Oswald; masthead cut in Grenze Gotisch. Page turns performed by GSAP.
        Letters to the desk:{" "}
        <a className="link-news" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>{" "}
        &middot;{" "}
        <a className="link-news" href={profile.phoneHref}>
          {profile.phone}
        </a>{" "}
        &middot;{" "}
        <a
          className="link-news"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{" "}
        &middot;{" "}
        <a
          className="link-news"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>{" "}
        &middot;{" "}
        <a
          className="link-news"
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Résumé
        </a>
        . &copy; {year} {profile.fullName}. All rights reserved, most wrongs
        reverted.
      </p>
    </section>
  );
}
