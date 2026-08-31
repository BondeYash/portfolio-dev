import type { Metadata } from "next";
import { EditionView } from "@/components/edition/edition-view";
import { profile } from "@/data/profile";
import { getGithubPortfolio } from "@/lib/github";
import { printedOn } from "@/lib/press";

export const metadata: Metadata = {
  title: "The Edition",
  description:
    "The bound twelve-page edition: profile, schooling, career, projects, markets and classifieds. Turn the pages by hand.",
};

export const revalidate = 43200;

export default async function EditionPage() {
  const github = await getGithubPortfolio();

  return (
    <>
      <h1 className="sr-only">
        Yash Times, bound edition — {profile.fullName}, {profile.role}
      </h1>
      <EditionView github={github} printedOn={printedOn()} />
    </>
  );
}
