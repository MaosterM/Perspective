"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Single mount point for scroll-driven motion. Renders nothing.
 *
 * Responsibilities (all scoped to a gsap.matchMedia so reduced-motion users
 * get none of the movement):
 *  - batch scroll reveals for every [data-reveal] element (adds `is-in`)
 *  - sets html[data-atmos] from the section in view (background mood shift)
 *  - scroll-driven depth drift on the fixed background slashes ([data-drift])
 *  - parallax on [data-parallax] project imagery (tablet and up)
 *  - scrubbed progress line on the experience timeline
 *  - pointer-reactive depth on the hero (fine pointers only)
 *
 * Everything is created inside useGSAP so it is reverted on unmount and on
 * route change, which also keeps React Strict Mode from duplicating triggers.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      window.__motionReady = true;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scroll reveals
        ScrollTrigger.batch("[data-reveal], [data-wipe]", {
          start: "top 90%",
          once: true,
          interval: 0.1,
          batchMax: 6,
          onEnter: (batch) => {
            batch.forEach((el, i) => {
              (el as HTMLElement).style.setProperty("--d", `${i * 70}ms`);
              el.classList.add("is-in");
            });
          },
        });

        // Atmosphere mood follows the section in view
        document.querySelectorAll<HTMLElement>("[data-atmos]").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive && section.dataset.atmos) {
                document.documentElement.dataset.atmos = section.dataset.atmos;
              }
            },
          });
        });

        // Background depth: the fixed crimson/blue slashes slide against the
        // page as it scrolls. data-drift is the travel in % of the element's
        // own height, in either direction; scrub smooths it. Transform only.
        document.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
          const amount = Number(el.dataset.drift ?? 0);
          if (!amount) return;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
              },
            },
          );
        });

        // Timeline progress
        document.querySelectorAll<HTMLElement>("[data-timeline-progress]").forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: bar.parentElement,
                start: "top 65%",
                end: "bottom 65%",
                scrub: true,
              },
            },
          );
        });
      });

      // Parallax: skipped on small screens to protect mid-range mobile performance
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      // Hero pointer depth: desktop-class pointers only
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        if (!hero) return;

        let frame = 0;
        let nx = 0;
        let ny = 0;

        const apply = () => {
          frame = 0;
          hero.style.setProperty("--px", nx.toFixed(3));
          hero.style.setProperty("--py", ny.toFixed(3));
        };
        const onMove = (event: PointerEvent) => {
          const rect = hero.getBoundingClientRect();
          nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => {
          nx = 0;
          ny = 0;
          if (!frame) frame = requestAnimationFrame(apply);
        };

        hero.addEventListener("pointermove", onMove, { passive: true });
        hero.addEventListener("pointerleave", onLeave);
        return () => {
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerleave", onLeave);
          if (frame) cancelAnimationFrame(frame);
        };
      });

      // Fonts change layout; recompute trigger positions once they are in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
