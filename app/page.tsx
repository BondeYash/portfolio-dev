import { PaperSite } from "@/components/edition/paper-site";
import { profile } from "@/data/profile";
import { getGithubPortfolio } from "@/lib/github";
import { printedOn } from "@/lib/press";

export const revalidate = 43200;

export default async function HomePage() {
  const github = await getGithubPortfolio();

  return (
    <>
      <h1 className="sr-only">
        {profile.fullName} — {profile.role} in {profile.location}. Portfolio set
        as a newspaper: profile, schooling, honours, career, toolkit, projects,
        repositories and contact, printed across twelve pages.
      </h1>
      <PaperSite github={github} printedOn={printedOn()} />
    </>
  );
}
