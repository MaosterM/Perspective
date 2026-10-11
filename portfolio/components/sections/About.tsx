import Image from "next/image";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Copy } from "@/components/ui/Copy";
import { SectionBackdrop } from "@/components/background/SectionBackdrop";

/** Three overlapping circles: the intersection the portfolio is about. Original artwork. */
function IntersectionDiagram() {
  return (
    <svg
      viewBox="0 0 520 480"
      role="img"
      aria-label="Diagram of three overlapping circles labelled Computer Science, Data Science and Finance"
      className="venn mx-auto block w-full max-w-md"
    >
      <circle className="venn-c stroke-sky" cx="200" cy="190" r="110" />
      <circle className="venn-c stroke-ink" cx="320" cy="190" r="110" />
      <circle className="venn-c stroke-crimson" cx="260" cy="292" r="110" />
      <circle cx="260" cy="224" r="4" className="fill-crimson" />
      <g className="fill-mute font-mono" style={{ fontSize: 11, letterSpacing: "0.16em" }}>
        <text x="96" y="64" textAnchor="middle">COMPUTER</text>
        <text x="96" y="80" textAnchor="middle">SCIENCE</text>
        <text x="424" y="64" textAnchor="middle">DATA</text>
        <text x="424" y="80" textAnchor="middle">SCIENCE</text>
        <text x="260" y="438" textAnchor="middle">FINANCE</text>
      </g>
    </svg>
  );
}

export function About() {
  const { about } = site;

  return (
    <section id="about" data-atmos="deep" aria-labelledby="about-title" className="section slash-top">
      <SectionBackdrop variant="sonar" />
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading index="02" label="About" id="about-title" lines={about.headline} />
            <div className="mt-12" data-reveal="fade">
              {about.portrait ? (
                <Image
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  width={about.portrait.width}
                  height={about.portrait.height}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full max-w-md border border-line"
                />
              ) : (
                <div data-reveal className="venn">
                  <IntersectionDiagram />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-32">
          <p className="t-lead prose-measure" data-reveal>
            {site.positioning}
          </p>

          <dl className="mt-12 border-b border-line" data-reveal>
            {about.facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[8rem_1fr] items-baseline gap-4 border-t border-line py-4">
                <dt className="t-label">{fact.label}</dt>
                <dd className="m-0 font-serif text-2xl italic text-ink sm:text-3xl">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 space-y-6">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="prose-measure text-mute" data-reveal>
                {paragraph}
              </p>
            ))}
            <div data-reveal className="prose-measure">
              <Copy text={about.personalNote} className="text-mute" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
