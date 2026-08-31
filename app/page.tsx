import { FrontPage } from "@/components/front/front-page";
import { getGithubPortfolio } from "@/lib/github";
import { printedOn } from "@/lib/press";

export const revalidate = 43200;

export default async function HomePage() {
  const github = await getGithubPortfolio();

  return <FrontPage github={github} printedOn={printedOn()} />;
}
