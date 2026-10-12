"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const onClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move keyboard/screen-reader context back to the top of the page.
    const top = document.getElementById("top") ?? document.getElementById("main");
    if (top) {
      if (!top.hasAttribute("tabindex")) top.setAttribute("tabindex", "-1");
      top.focus({ preventScroll: true });
    }
  };

  return (
    <button type="button" onClick={onClick} className="btn btn-ghost">
      <ArrowUp size={16} aria-hidden="true" />
      <span>Back to top</span>
    </button>
  );
}
