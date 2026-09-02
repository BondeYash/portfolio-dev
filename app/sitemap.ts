import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * The edition is one document. Its sections are leaves of the same sheet, not
 * separate URLs, so the map lists the one page a crawler should fetch.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
