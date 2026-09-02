import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** "Jun 2026" -> "2026-06", so a date is a date and not a label. */
function isoMonth(period: string): string | undefined {
  const match = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(period.trim());
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  return month ? `${match[2]}-${month}` : undefined;
}

/**
 * The entity graph, for the search engines rather than the reader.
 *
 * A search for a person's name is answered from an entity, not from a page of
 * matching words. This tells Google that the name, the job, the schools, the
 * employer and the GitHub and LinkedIn accounts are all one person, and that
 * this domain is that person's own site — which is what earns the top result
 * for a branded query, and what a Knowledge Panel is built from.
 *
 * The telephone number is deliberately left out. It is on the page for a human
 * who wants it; structured data is harvested in bulk, and a phone number adds
 * nothing to a name query.
 */
export function StructuredData() {
  const person = `${siteUrl}/#person`;
  const website = `${siteUrl}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: profile.fullName,
        givenName: "Yash",
        familyName: "Bonde",
        alternateName: ["Yash", "BondeYash"],
        url: `${siteUrl}/`,
        mainEntityOfPage: { "@id": `${siteUrl}/#webpage` },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/portrait.jpg`,
          width: 1100,
          height: 1100,
          caption: `${profile.fullName}, ${profile.role}`,
        },
        jobTitle: profile.role,
        description: profile.bio,
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Surat",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        homeLocation: {
          "@type": "Place",
          name: profile.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Surat",
            addressRegion: "Gujarat",
            addressCountry: "IN",
          },
        },
        hasOccupation: {
          "@type": "Occupation",
          name: profile.role,
          occupationLocation: { "@type": "City", name: "Surat" },
          skills: profile.skillGroups
            .filter((group) => group.label !== "Soft skills")
            .flatMap((group) => group.items)
            .join(", "),
        },
        knowsLanguage: ["en", "hi", "gu"],
        /* The accounts that already rank for the name, claimed as the same
           person, so their authority resolves to this entity. */
        sameAs: [profile.github, profile.linkedin],
        worksFor: {
          "@type": "Organization",
          name: profile.experience[0].company,
        },
        alumniOf: profile.education.map((school) => ({
          "@type": "CollegeOrUniversity",
          name: school.school,
        })),
        knowsAbout: profile.skillGroups
          .filter((group) => group.label !== "Soft skills")
          .flatMap((group) => group.items),
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: `${siteUrl}/`,
        name: `${profile.fullName} — ${profile.role}`,
        alternateName: "Yash Times",
        inLanguage: "en",
        publisher: { "@id": person },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: `${profile.fullName} — ${profile.role}`,
        description: profile.subheading,
        isPartOf: { "@id": website },
        about: { "@id": person },
        primaryImageOfPage: `${siteUrl}/portrait.jpg`,
        dateModified: new Date().toISOString(),
        inLanguage: "en",
      },
      /* The work itself, credited. A search for the person and one of their
         projects has something to resolve to. */
      ...profile.projects.slice(0, 6).map((project, index) => ({
        "@type": "SoftwareSourceCode",
        "@id": `${siteUrl}/#project-${index + 1}`,
        name: project.name,
        description: project.bullets[0],
        programmingLanguage: project.stack.split(",").map((s) => s.trim()),
        keywords: project.stack,
        dateCreated: isoMonth(project.period),
        creator: { "@id": person },
        author: { "@id": person },
        isPartOf: { "@id": `${siteUrl}/#webpage` },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      suppressHydrationWarning
    />
  );
}
