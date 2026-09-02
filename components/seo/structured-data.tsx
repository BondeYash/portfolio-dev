import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

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
        image: `${siteUrl}/portrait.jpg`,
        jobTitle: profile.role,
        description: profile.bio,
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Surat",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
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
