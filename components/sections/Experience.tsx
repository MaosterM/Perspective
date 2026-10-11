import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/background/SectionBackdrop";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" data-atmos="deep" aria-labelledby="experience-title" className="section slash-top">
      <SectionBackdrop variant="clock" />
      <div className="wrap">
        <SectionHeading
          index="04"
          label="Experience"
          id="experience-title"
          lines={[{ text: "Experience &" }, { text: "involvement", em: true }]}
        />
        <p className="t-lead prose-measure mt-8 text-mute" data-reveal>
          Committee roles at two university events.
        </p>

        <div className="relative mt-16 md:mt-24">
          <div className="timeline-rail" aria-hidden="true" />
          <div className="timeline-progress" data-timeline-progress aria-hidden="true" />

          <ol className="m-0 list-none space-y-20 p-0 md:space-y-28">
            {experience.map((entry, i) => (
              <li key={entry.id} className="relative pl-9 sm:pl-14" data-testid="experience-entry">
                <span className="timeline-dot" data-current={entry.status === "current"} aria-hidden="true" />

                <article className={cn("max-w-4xl", i % 2 === 1 && "lg:ml-[18%]")} data-reveal>
                  <p className="tag">{entry.statusLabel}</p>
                  <h3 className="t-display mt-4 text-[length:clamp(2.5rem,1.5rem+4.5vw,5.5rem)]">{entry.organization}</h3>
                  <p className="mt-3 font-serif text-2xl italic text-sky sm:text-3xl">{entry.role}</p>
                  <p className="t-label mt-3">{entry.context}</p>

                  <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    {entry.details.map((detail) => (
                      <div key={detail.label}>
                        <dt className="t-label text-ink">{detail.label}</dt>
                        <dd className="m-0 mt-2">
                          {detail.items.length > 0 ? (
                            <ul className="space-y-1.5 pl-4 text-mute">
                              {detail.items.map((item) => (
                                <li key={item} className="list-disc">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ph">{detail.hint}</p>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
