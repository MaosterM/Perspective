"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

/**
 * Brief opening sequence (~1.5s): a cyan line draws, the monogram rises, a
 * crimson slash sweeps through, and the overlay lifts away to release the hero.
 *
 * Guard rails:
 *  - Only runs when the head script marked motion as allowed (html.js), so
 *    reduced-motion users and no-JS visitors get the page immediately.
 *  - Plays once per browser session.
 *  - The overlay is pointer-events: none, so it never blocks navigation, and
 *    any key press or tap fast-forwards it.
 *  - CSS hides it by default and `.reveal-all` removes it if scripts stall.
 */
export function Intro({ initials }: { initials: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      window.__motionReady = true;

      if (!html.classList.contains("js")) return;

      if (html.classList.contains("intro-seen")) {
        html.classList.add("hero-in");
        return;
      }

      const release = () => {
        html.classList.add("hero-in");
        try {
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          /* storage unavailable: harmless */
        }
      };

      const tl = gsap.timeline({
        onComplete: () => {
          if (root.current) root.current.style.display = "none";
        },
      });

      tl.fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
        .fromTo(
          ".intro-mark > span",
          { yPercent: 112 },
          { yPercent: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          "-=0.15",
        )
        .fromTo(
          ".intro-slash",
          { xPercent: -140 },
          { xPercent: 900, duration: 0.6, ease: "power2.inOut" },
          "+=0.1",
        )
        .add(release, "-=0.25")
        .to(
          root.current,
          { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", duration: 0.6, ease: "power3.inOut" },
          "<",
        );

      const skip = () => tl.timeScale(4);
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("pointerdown", skip, { once: true });

      return () => {
        window.removeEventListener("keydown", skip);
        window.removeEventListener("pointerdown", skip);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <div>
        <span className="intro-line" />
        <div className="intro-mark">
          {initials.split("").map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </div>
      </div>
      <span className="intro-slash" />
    </div>
  );
}
