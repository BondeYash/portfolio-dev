import Image from "next/image";
import type { EditionPage } from "@/components/edition/flipbook";
import { paper, profile } from "@/data/profile";
import { formatUpdated } from "@/lib/format";
import { languageColor } from "@/lib/language-colors";
import type { GithubPayload } from "@/lib/types";

/* The commissioned portrait: the engineer photographed on the frontier
   set, printed as this edition's plate. */
const PORTRAIT = "/portrait.jpg";

/* ------------------------------------------------------------------
   The twelve printed pages of the edition. Each one is composed for a
   380 x 543 canvas and scaled to whatever the reader's screen allows.
   ------------------------------------------------------------------ */

function RunningHead({ section, folio }: { section: string; folio: string }) {
  return (
    <header className="shrink-0">
      <div className="flex items-baseline justify-between">
        <span className="pg-slug">{paper.title}</span>
        <span className="pg-slug tabular">Page {folio}</span>
      </div>
      <div className="mt-0.5 border-b-2 border-rule" />
      <div className="flex items-baseline justify-between pt-0.5">
        <span className="pg-label text-spot">{section}</span>
        <span className="pg-slug">{paper.city}</span>
      </div>
      <div className="mt-0.5 border-b border-rule/50" />
    </header>
  );
}

function PageFrame({
  section,
  folio,
  children,
  footnote,
}: {
  section: string;
  folio: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  return (
    <>
      <RunningHead section={section} folio={folio} />
      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
      <footer className="mt-1.5 shrink-0 border-t border-rule/50 pt-1">
        <div className="flex items-baseline justify-between">
          <span className="pg-slug tabular">{folio}</span>
          <span className="pg-slug">
            {footnote ?? paper.motto}
          </span>
        </div>
      </footer>
    </>
  );
}

function FactRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-rule/25 py-[3px]">
      <dt className="pg-label shrink-0 text-faded">{term}</dt>
      <dd className="pg-copy !text-right !text-[10.5px] !leading-tight">
        {children}
      </dd>
    </div>
  );
}

export function buildEditionPages(github: GithubPayload): EditionPage[] {
  const { profile: gh, repos, source } = github;

  return [
    /* ---------------- 01 · COVER ---------------- */
    {
      id: "cover",
      section: "Cover",
      folio: "01",
      bleed: true,
      node: (
        <div className="relative h-full w-full overflow-hidden bg-stock">
          {/* the plate, printed to the trim */}
          <Image
            src={PORTRAIT}
            alt={`${profile.fullName}, photographed for this edition`}
            fill
            priority
            sizes="(min-width: 900px) 50vw, 100vw"
            className="cover-plate object-cover object-[center_34%]"
          />
          <div aria-hidden="true" className="cover-wash absolute inset-0" />

          <div className="relative flex h-full flex-col">
            {/* the nameplate, set on stock so it reads at any size */}
            <div className="cover-slip border-b-[3px] border-rule px-5 pb-1.5 pt-3">
              <div className="flex items-baseline justify-between">
                <span className="pg-slug">{paper.volume}</span>
                <span className="pg-slug misregister !text-spot">
                  Bound Edition
                </span>
                <span className="pg-slug">{paper.number}</span>
              </div>
              <div className="mt-1 border-b-2 border-rule" />
              <h1 className="masthead cover-title py-1.5 text-center text-[3rem] leading-[0.84]">
                {paper.title}
              </h1>
              <div className="border-b-2 border-rule" />
              <p className="pg-slug pt-1 text-center">
                {paper.city} &middot; {paper.motto}
              </p>
            </div>

            {/* the photograph carries the middle of the page */}
            <div className="min-h-0 flex-1" />

            {/* the deck, pasted over the foot of the plate */}
            <div className="cover-slip border-t-[3px] border-rule px-5 pb-3 pt-2">
              <p className="pg-kicker">
                The Frontier Desk &middot; Twelve Pages
              </p>
              <h2 className="pg-hed cover-hed mt-0.5 text-[1.95rem] leading-[0.98]">
                One Engineer,
                <br />
                Bound In Full
              </h2>
              <p className="pg-dek mt-1.5">{profile.subheading}</p>
              <div className="mt-2 flex items-baseline justify-between border-t border-rule/40 pt-1">
                <span className="pg-slug">
                  {profile.fullName} &middot; {paper.wire}
                </span>
                <span className="pg-label text-spot">
                  Turn the corner &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    /* ---------------- 02 · THE PROFILE ---------------- */
    {
      id: "profile",
      section: "The Profile",
      folio: "02",
      node: (
        <PageFrame section="The Profile" folio="02">
          <p className="pg-kicker">Page Two &middot; Exclusive</p>
          <h2 className="pg-hed mt-1 text-[1.7rem]">
            The Engineer Who Tests His Own Ledgers
          </h2>
          <p className="pg-dek mt-1.5">{profile.subheading}</p>
          <p className="pg-slug mt-1">
            By {profile.fullName} &middot; {paper.wire}
          </p>
          <div className="my-1.5 border-y-2 border-rule py-[1px]" />

          <div className="pg-cols">
            <p className="pg-copy pg-drop">{profile.bio}</p>
            <p className="pg-copy mt-1.5">
              His work runs from double-entry ledgers with deterministic lock
              ordering to retrieval pipelines that cluster the day&rsquo;s news
              before a single word is drafted. The connective tissue is a
              refusal to ship what has not been exercised.
            </p>
            <div className="my-1.5 border-y-2 border-rule py-1">
              <p className="font-hed text-[12.5px] font-bold italic leading-tight">
                &ldquo;{profile.tagline}&rdquo;
              </p>
            </div>
            <p className="pg-copy">
              Based in {profile.location}, he keeps the same standard across
              stacks: {profile.skillGroups[1].items.slice(0, 4).join(", ")} on
              the server, {profile.skillGroups[2].items.slice(0, 3).join(", ")}{" "}
              in the browser, and a test suite that has to pass before anything
              reaches a user.
            </p>
          </div>

          <p className="pg-label mt-2 text-faded">
            Continued on page 03 &rarr;
          </p>
        </PageFrame>
      ),
    },

    /* ---------------- 03 · VITALS ---------------- */
    {
      id: "vitals",
      section: "Vitals",
      folio: "03",
      node: (
        <PageFrame section="Vitals" folio="03">
          <p className="pg-kicker">The Record, In Brief</p>
          <h2 className="pg-hed mt-1 text-[1.4rem]">Particulars</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <div className="flex gap-2.5">
            <figure className="w-[36%] shrink-0">
              <div className="halftone relative aspect-[3/4] w-full overflow-hidden border-2 border-rule">
                <Image
                  src={PORTRAIT}
                  alt={`${profile.fullName}`}
                  fill
                  sizes="140px"
                  className="object-cover object-[center_28%]"
                />
              </div>
              <figcaption className="pg-slug mt-1 leading-snug">
                Filed from the desk.
              </figcaption>
            </figure>

            <dl className="min-w-0 flex-1">
              <FactRow term="Name">{profile.fullName}</FactRow>
              <FactRow term="Desk">{profile.role}</FactRow>
              <FactRow term="Base">{profile.location}</FactRow>
              <FactRow term="Wire">{profile.email}</FactRow>
              <FactRow term="Telephone">{profile.phone}</FactRow>
              <FactRow term="Handle">{gh.login}</FactRow>
              <FactRow term="Repositories">{gh.publicRepos}</FactRow>
              <FactRow term="Subscribers">{gh.followers}</FactRow>
            </dl>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[
              [String(profile.projects.length), "Flagship builds"],
              [String(profile.experience.length), "Postings held"],
              [String(profile.certifications.length), "Honours filed"],
            ].map(([figure, caption]) => (
              <div key={caption} className="border-2 border-rule p-1.5 text-center">
                <p className="font-hed text-[1.6rem] font-black leading-none">
                  {figure}
                </p>
                <p className="pg-slug mt-0.5 leading-tight">{caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 border border-rule/60 p-2">
            <p className="pg-kicker">On The Beat</p>
            <p className="pg-copy mt-1 !text-[11px]">
              {gh.bio ?? profile.subheading}
            </p>
          </div>
        </PageFrame>
      ),
    },

    /* ---------------- 04 · SCHOOLING ---------------- */
    {
      id: "schooling",
      section: "Schooling",
      folio: "04",
      node: (
        <PageFrame section="Schooling" folio="04">
          <p className="pg-kicker">Education Desk</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">
            A Decade of Marked Papers
          </h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <ul className="space-y-2.5">
            {profile.education.map((item) => (
              <li key={item.school} className="border-b border-rule/40 pb-2">
                <p className="pg-slug">
                  {item.duration} &middot; {item.location}
                </p>
                <h3 className="pg-hed mt-0.5 text-[1.05rem]">{item.school}</h3>
                <p className="pg-copy mt-1">{item.degree}.</p>
                <p className="pg-label mt-1 text-spot">{item.detail}</p>
              </li>
            ))}
          </ul>

          <div className="mt-2 border-2 border-rule p-2">
            <p className="pg-kicker">Examiner&rsquo;s Note</p>
            <p className="pg-copy mt-1">
              Two computer engineering programmes, both finished with marks in
              the top band, and a habit of building outside the syllabus. The
              diploma years produced the first shipped projects; the degree
              years produced the first production incidents, which taught more.
            </p>
          </div>
        </PageFrame>
      ),
    },

    /* ---------------- 05 · HONOURS ---------------- */
    {
      id: "honours",
      section: "Honours",
      folio: "05",
      node: (
        <PageFrame section="Honours" folio="05">
          <p className="pg-kicker">Awards &amp; Certifications</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Filed for the Record</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <ul className="space-y-1.5">
            {profile.certifications.map((item, index) => (
              <li
                key={item}
                className="flex gap-2 border-b border-rule/30 pb-1.5"
              >
                <span className="font-hed text-[1.1rem] font-black leading-none text-spot">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pg-copy !text-left">{item}</p>
              </li>
            ))}
          </ul>

          <div className="mt-auto" />
          <p className="pg-copy mt-2 !text-[10.5px] italic">
            Certificates are available for inspection on request. The awards
            are pleasant; the repositories are the argument.
          </p>
        </PageFrame>
      ),
    },

    /* ---------------- 06 · BUSINESS ---------------- */
    {
      id: "business",
      section: "Business",
      folio: "06",
      node: (
        <PageFrame section="Business" folio="06">
          <p className="pg-kicker">Career Desk</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Postings &amp; Assignments</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <ol className="space-y-2">
            {profile.experience.map((job) => (
              <li key={job.company} className="border-b border-rule/40 pb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="pg-hed text-[1rem]">{job.company}</h3>
                  <span className="pg-slug shrink-0 tabular">
                    {job.duration}
                  </span>
                </div>
                <p className="pg-label mt-0.5 text-spot">{job.role}</p>
                <p className="pg-slug">{job.location}</p>
                <ul className="mt-1 space-y-1">
                  {job.bullets.map((line) => (
                    <li key={line} className="pg-copy">
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </PageFrame>
      ),
    },

    /* ---------------- 07 · THE TOOLKIT ---------------- */
    {
      id: "toolkit",
      section: "The Toolkit",
      folio: "07",
      node: (
        <PageFrame section="The Toolkit" folio="07">
          <p className="pg-kicker">Composing Room</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">The Type Case</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <div className="space-y-1.5">
            {profile.skillGroups.map((group) => (
              <div key={group.label} className="border border-rule/50 p-1.5">
                <p className="pg-kicker">{group.label}</p>
                <p className="pg-copy mt-0.5 !text-left !text-[10.5px] !leading-[1.35]">
                  {group.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <p className="pg-copy mt-2 !text-[10.5px] italic">
            Set by hand, proofed by CI. Every line above has shipped to a real
            environment at least once.
          </p>
        </PageFrame>
      ),
    },

    /* ---------------- 08 · PROJECTS I ---------------- */
    {
      id: "projects-1",
      section: "Projects I",
      folio: "08",
      node: (
        <PageFrame section="Projects, Part I" folio="08">
          <p className="pg-kicker">Technology</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Built &amp; Shipped</h2>
          <div className="my-1.5 border-b-2 border-rule" />
          <ProjectBlock index={0} />
          <div className="my-2 border-t-2 border-rule" />
          <ProjectBlock index={1} />
        </PageFrame>
      ),
    },

    /* ---------------- 09 · PROJECTS II ---------------- */
    {
      id: "projects-2",
      section: "Projects II",
      folio: "09",
      node: (
        <PageFrame section="Projects, Part II" folio="09">
          <p className="pg-kicker">Technology, continued</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Tooling &amp; Craft</h2>
          <div className="my-1.5 border-b-2 border-rule" />
          <ProjectBlock index={2} />
          <div className="my-2 border-t-2 border-rule" />
          <ProjectBlock index={3} />
        </PageFrame>
      ),
    },

    /* ---------------- 10 · MARKETS ---------------- */
    {
      id: "markets",
      section: "Markets",
      folio: "10",
      node: (
        <PageFrame
          section="Markets"
          folio="10"
          footnote={source === "live" ? "Live wire" : "Cached tape"}
        >
          <p className="pg-kicker">Repository Index</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Open Source Board</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-rule">
                <th scope="col" className="pg-label py-1 text-left">
                  Issue
                </th>
                <th scope="col" className="pg-label py-1 text-left">
                  Sector
                </th>
                <th scope="col" className="pg-label py-1 text-right">
                  Stars
                </th>
                <th scope="col" className="pg-label py-1 text-right">
                  Traded
                </th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo) => (
                <tr key={repo.name} className="border-b border-rule/30">
                  <td className="py-1 pr-1">
                    <span className="pg-label block leading-tight">
                      {repo.name}
                    </span>
                    <span className="pg-slug block leading-tight">
                      {repo.description
                        ? repo.description.slice(0, 44)
                        : "No prospectus filed"}
                    </span>
                  </td>
                  <td className="py-1">
                    <span className="pg-slug inline-flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="inline-block h-[6px] w-[6px] rounded-full ring-1 ring-rule/50"
                        style={{
                          backgroundColor: languageColor(repo.language),
                        }}
                      />
                      {repo.language ?? "Mixed"}
                    </span>
                  </td>
                  <td className="pg-label tabular py-1 text-right text-spot">
                    &#9650; {repo.stars}
                  </td>
                  <td className="pg-slug tabular py-1 text-right">
                    {formatUpdated(repo.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="pg-copy mt-2 !text-[10.5px]">
            Index compiled from {gh.publicRepos} public repositories held by{" "}
            {gh.login}. Quotations are indicative; forks settle immediately.
          </p>
        </PageFrame>
      ),
    },

    /* ---------------- 11 · CLASSIFIEDS ---------------- */
    {
      id: "classifieds",
      section: "Classifieds",
      folio: "11",
      node: (
        <PageFrame section="Classifieds" folio="11">
          <p className="pg-kicker">Situations Wanted</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">Terms of Engagement</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <div className="space-y-1.5">
            {[
              {
                head: "Engineer Available",
                body: `Full-stack. ${profile.location}. Backends that hold, interfaces that explain themselves.`,
                cta: profile.email,
                href: `mailto:${profile.email}`,
              },
              {
                head: "Telephone Enquiries",
                body: "For urgent threads and contract discussions. IST business hours, mostly.",
                cta: profile.phone,
                href: profile.phoneHref,
              },
              {
                head: "Source Code, Open",
                body: "Ledgers, agents, audits and scaffolding, published for inspection.",
                cta: "github.com/BondeYash",
                href: profile.github,
              },
              {
                head: "Professional Notices",
                body: "Career history, endorsements, and the occasional argument about type systems.",
                cta: "LinkedIn",
                href: profile.linkedin,
              },
              {
                head: "Résumé, One Page",
                body: "The complete record, delivered as PDF. No subscription required.",
                cta: "Collect a copy",
                href: profile.resumeUrl,
              },
            ].map((ad) => (
              <a
                key={ad.head}
                href={ad.href}
                target={ad.href.startsWith("mailto:") || ad.href.startsWith("tel:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="block border border-rule/60 p-1.5 transition-colors hover:bg-stock"
              >
                <p className="pg-label">{ad.head}</p>
                <p className="pg-copy !text-left !text-[10.5px] !leading-[1.35]">
                  {ad.body}
                </p>
                <p className="pg-slug mt-0.5 text-spot">{ad.cta} &rarr;</p>
              </a>
            ))}
          </div>
        </PageFrame>
      ),
    },

    /* ---------------- 12 · BACK PAGE ---------------- */
    {
      id: "back-page",
      section: "Back Page",
      folio: "12",
      node: (
        <PageFrame section="Back Page" folio="12" footnote="End of edition">
          <p className="pg-kicker">Colophon</p>
          <h2 className="pg-hed mt-1 text-[1.5rem]">How This Was Printed</h2>
          <div className="my-1.5 border-b-2 border-rule" />

          <div className="pg-cols">
            <p className="pg-copy">
              This edition is composed in Next.js and React, set in Playfair
              Display, Source Serif and Oswald, with the masthead cut in
              Grenze Gotisch. Pages are hinged at the spine and turned by
              GSAP on a single web thread.
            </p>
            <p className="pg-copy mt-1.5">
              The market pages are wired from the GitHub API and cached for
              twelve hours; when the wire goes quiet, the last filed close is
              printed instead. Paper texture, halftone screens and press
              misregistration are drawn in CSS, not photographed.
            </p>
            <p className="pg-copy mt-1.5">
              No trees were consulted. The paper rustle you hear on each turn is
              band-passed white noise, generated in the browser.
            </p>
          </div>

          <div className="mt-2 border-2 border-double border-rule p-2 text-center">
            <p className="masthead text-[1.35rem] leading-none">{paper.title}</p>
            <p className="pg-slug mt-1">
              {paper.volume} &middot; {paper.number} &middot; {paper.established}
            </p>
            <p className="pg-copy mt-1.5 !text-center !text-[10.5px]">
              Thank you for reading to the back page. Most readers stop at the
              fold.
            </p>
          </div>

          <p className="pg-label mt-auto pt-2 text-center text-spot">
            &larr; Turn back, or return to the front page
          </p>
        </PageFrame>
      ),
    },
  ];
}

function ProjectBlock({ index }: { index: number }) {
  const project = profile.projects[index];
  if (!project) return null;
  return (
    <article>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="pg-hed text-[1.05rem]">{project.name}</h3>
        <span className="pg-slug shrink-0 tabular">{project.period}</span>
      </div>
      <div className="my-1 border-b border-rule/50" />
      <ul className="space-y-1">
        {project.bullets.map((line) => (
          <li key={line} className="pg-copy">
            {line}
          </li>
        ))}
      </ul>
      <p className="pg-slug mt-1 leading-snug">Filed under: {project.stack}</p>
    </article>
  );
}
