import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/background/SectionBackdrop";

export function Skills() {
  return (
    <section id="skills" data-atmos="blue" aria-labelledby="skills-title" className="section">
      <SectionBackdrop variant="digits" />
      <div className="wrap">
        <SectionHeading
          index="03"
          label="Skills"
          id="skills-title"
          lines={[{ text: "Technical" }, { text: "interests", em: true }]}
          className="mb-14 md:mb-20"
        />

        <ol className="m-0 grid list-none gap-x-10 gap-y-14 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <li key={group.id} data-reveal className="border-t border-line pt-6">
              <p className="num-outline text-5xl" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-h3 mt-4 !text-[length:clamp(1.35rem,1.1rem+1vw,2rem)]">{group.title}</h3>
              {group.basis ? <p className="tag mt-3">{group.basis}</p> : null}

              {group.items.length > 0 ? (
                <ul className="mt-5 space-y-1.5 text-mute">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="ph mt-5">Add the tools and skills you can genuinely stand behind in data/skills.ts.</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
