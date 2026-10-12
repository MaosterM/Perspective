import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/**
 * GSAP-side mirror of the motion tokens defined as CSS custom properties in
 * app/globals.css (--dur-*, --ease-*). Keep the two in sync; DESIGN.md lists both.
 * CSS handles simple transitions; GSAP handles the intro, scrubbed scroll
 * effects and section tracking.
 */
export const motion = {
  duration: { micro: 0.18, standard: 0.35, feature: 0.6 },
  stagger: { tight: 0.04, base: 0.07, wide: 0.1 },
  ease: { out: "power3.out", inOut: "power2.inOut", expo: "expo.out" },
} as const;

declare global {
  interface Window {
    /** Set once client-side motion has taken over. The inline head script's failsafe checks it. */
    __motionReady?: boolean;
  }
}
