import { site } from "@/data/site";
import { getInitials } from "@/lib/utils";
import { Intro } from "@/components/motion/Intro";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Intro initials={getInitials(site.name, site.monogramFallback)} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Beyond />
        <Contact />
      </main>
    </>
  );
}
