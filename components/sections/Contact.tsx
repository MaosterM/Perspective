import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/data/site";
import { beyondEntries } from "@/data/beyond";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { isConfiguredEmail, isConfiguredUrl } from "@/lib/utils";

interface Channel {
  id: string;
  label: string;
  /** Resolved destination, or null when still a placeholder. */
  href: string | null;
  display: string | null;
  external: boolean;
}

/** "https://github.com/name/" -> "github.com/name" */
function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    return (u.host + u.pathname).replace(/\/$/, "");
  } catch {
    return url;
  }
}

function buildChannels(): Channel[] {
  const { email, github, linkedin, instagram } = site.contact;
  return [
    {
      id: "email",
      label: "Email",
      href: isConfiguredEmail(email) ? `mailto:${email.trim()}` : null,
      display: isConfiguredEmail(email) ? email.trim() : null,
      external: false,
    },
    {
      id: "github",
      label: "GitHub",
      href: isConfiguredUrl(github) ? github : null,
      display: isConfiguredUrl(github) ? prettyUrl(github) : null,
      external: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: isConfiguredUrl(linkedin) ? linkedin : null,
      display: isConfiguredUrl(linkedin) ? prettyUrl(linkedin) : null,
      external: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: isConfiguredUrl(instagram) ? instagram : null,
      display: isConfiguredUrl(instagram) ? prettyUrl(instagram) : null,
      external: true,
    },
  ];
}

export function Contact() {
  const channels = buildChannels();
  const emailValue = isConfiguredEmail(site.contact.email) ? site.contact.email.trim() : null;
  const resume = isConfiguredUrl(site.contact.resume) ? site.contact.resume : null;

  return (
    <section id="contact" data-atmos="crimson" aria-labelledby="contact-title" className="section slash-top overflow-hidden">
      <span className="slash-wipe" data-wipe aria-hidden="true" />

      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeading index={beyondEntries.length > 0 ? "06" : "05"} label="Contact" id="contact-title" lines={site.contactCopy.headline} />
            <p className="t-lead prose-measure mt-8 text-mute" data-reveal>
              {site.contactCopy.support}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4" data-reveal>
              {emailValue ? (
                <>
                  <a href={`mailto:${emailValue}`} className="btn btn-primary">
                    <Mail size={16} aria-hidden="true" />
                    <span>Send an email</span>
                  </a>
                  <CopyEmailButton email={emailValue} />
                </>
              ) : null}
              {resume ? (
                <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <span>View résumé</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </div>

          <ul className="m-0 list-none border-b border-line p-0 lg:col-span-5 lg:col-start-8 lg:pt-24" data-reveal>
            {channels.map((channel) => (
              <li key={channel.id}>
                {channel.href && channel.display ? (
                  <a
                    href={channel.href}
                    className="channel"
                    data-testid={`channel-${channel.id}`}
                    {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={channel.external ? `${channel.label}: ${channel.display} (opens in a new tab)` : `${channel.label}: ${channel.display}`}
                  >
                    <span className="t-label">{channel.label}</span>
                    <span className="truncate font-serif text-xl italic sm:text-2xl">{channel.display}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <div className="channel channel-unset" data-testid={`channel-${channel.id}-unset`}>
                    <span className="t-label">{channel.label}</span>
                    <span className="ph !border-0 !p-0">Not set. Add it in data/site.ts</span>
                    <span aria-hidden="true" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden="true"
          className="num-outline mt-24 select-none overflow-hidden whitespace-nowrap text-center text-[clamp(3rem,13vw,13rem)] uppercase"
        >
          {site.name}
        </p>
      </div>
    </section>
  );
}
