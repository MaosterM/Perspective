import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/background/SectionBackdrop";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";

export function Projects() {
  return (
    <section id="projects" data-atmos="blue" aria-labelledby="projects-title" className="section">
      <SectionBackdrop variant="market" />
      <div className="wrap">
        <SectionHeading
          index="01"
          label="Selected projects"
          id="projects-title"
          lines={[{ text: "Selected" }, { text: "work", em: true }]}
          className="mb-14 md:mb-20"
        />
        <ProjectsExplorer projects={projects} />
      </div>
    </section>
  );
}
