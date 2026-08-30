import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { getGithubPortfolio } from "@/lib/github";

export default async function HomePage() {
  const github = await getGithubPortfolio();

  return (
    <>
      <main>
        <Hero github={github.profile} />
        <About />
        <Projects repos={github.repos} source={github.source} />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
