"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { Monogram } from "@/components/ui/Monogram";
import type { NavItem } from "@/data/site";

interface NavbarProps {
  nav: NavItem[];
  initials: string;
  /** Only passed when a valid resume URL is configured. */
  resumeUrl?: string;
  /** Section id -> nav id it should highlight (null = none). */
  sectionNav: Record<string, string | null>;
  ownerLabel: string;
}

export function Navbar({ nav, initials, resumeUrl, sectionNav, ownerLabel }: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const containerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);
  const indicatorRef = useRef<HTMLLIElement>(null);

  // Section tracking + scrolled state via ScrollTrigger (no manual scroll listeners).
  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => setScrolled(self.isActive),
      });

      if (!isHome) {
        setActive(null);
        return;
      }

      Object.entries(sectionNav).forEach(([sectionId, navId]) => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(navId);
          },
        });
      });
    },
    { dependencies: [pathname, isHome], revertOnUpdate: true },
  );

  // Animated active-section indicator. Written straight to CSS variables (no state, no re-render);
  // the transition lives in CSS.
  const measure = useCallback(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const link = active ? linkRefs.current[active] : null;
    if (!link) {
      indicator.dataset.visible = "false";
      return;
    }
    const inset = 14;
    indicator.style.setProperty("--ind-x", `${link.offsetLeft + inset}px`);
    indicator.style.setProperty("--ind-w", `${Math.max(0, link.offsetWidth - inset * 2)}px`);
    indicator.dataset.visible = "true";
  }, [active]);

  useEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  // Mobile menu: focus management and predictable dismissal (no scroll lock).
  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    firstMobileLink.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) closeMenu(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, closeMenu]);

  const onBlurCapture = (event: React.FocusEvent) => {
    if (!open) return;
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current && !containerRef.current.contains(next)) setOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <nav
        ref={containerRef}
        aria-label="Primary"
        onBlurCapture={onBlurCapture}
        className="pointer-events-auto relative w-full max-w-[44rem]"
      >
        <div className="nav-shell flex items-center justify-between gap-2 rounded-[var(--radius-1)] py-1.5 pl-2 pr-2" data-scrolled={scrolled}>
          <Link href="/#top" aria-label={`${ownerLabel}: back to top`} className="rounded-[var(--radius-1)] p-0.5">
            <Monogram initials={initials} />
          </Link>

          {/* Desktop links */}
          <ul ref={listRef} className="relative hidden items-center md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  ref={(el) => {
                    linkRefs.current[item.id] = el;
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className="relative block px-3.5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mute transition-colors hover:text-ink focus-visible:text-ink aria-[current=location]:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li ref={indicatorRef} aria-hidden="true" className="nav-indicator" data-visible="false" />
          </ul>

          <div className="flex items-center gap-1">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-h-11 items-center gap-2 px-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-sky sm:inline-flex"
              >
                <FileText size={14} aria-hidden="true" />
                Résumé
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}

            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile disclosure menu */}
        {open ? (
          <div id="mobile-menu" className="nav-shell mt-2 rounded-[var(--radius-1)] p-2 md:hidden" data-scrolled="true">
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <li key={item.id}>
                  <Link
                    ref={i === 0 ? firstMobileLink : undefined}
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "location" : undefined}
                    className="flex min-h-12 items-center justify-between px-3 font-mono text-sm uppercase tracking-[0.16em] text-mute hover:text-ink aria-[current=location]:text-ink"
                  >
                    {item.label}
                    {active === item.id ? <span aria-hidden="true" className="h-0.5 w-6 -skew-x-[30deg] bg-crimson" /> : null}
                  </Link>
                </li>
              ))}
              {resumeUrl ? (
                <li>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center gap-2 px-3 font-mono text-sm uppercase tracking-[0.16em] text-ink"
                  >
                    <FileText size={14} aria-hidden="true" />
                    Résumé
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
