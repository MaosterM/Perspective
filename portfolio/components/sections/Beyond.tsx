import { beyondEntries } from "@/data/beyond";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Optional section. Renders nothing until real entries are added to
 * data/beyond.ts, so no hobbies or stories are ever invented.
 */
export function Beyond() {
  if (beyondEntries.length === 0) return null;

  return (
    <section id="beyond" data-atmos="blue" aria-labelledby="beyond-title" className="section">
      <div className="wrap">
        <SectionHeading
          index="05"
          label="Beyond the screen"
          id="beyond-title"
          lines={[{ text: "Beyond the" }, { text: "screen", em: true }]}
          className="mb-14 md:mb-20"
        />
        <ul className="m-0 grid list-none gap-x-10 gap-y-12 p-0 md:grid-cols-2">
          {beyondEntries.map((entry) => (
            <li key={entry.id} data-reveal className="border-t border-line pt-6">
              <h3 className="t-h3">{entry.title}</h3>
              <p className="prose-measure mt-4 text-mute">{entry.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
