import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { ownerName } from "@/lib/utils";

export const alt = "Portfolio: Computer Science, Data Science and Finance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated at build time from site config. Replace with a designed image in /public if preferred. */
export default function OpenGraphImage() {
  const name = ownerName();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#080b16",
          color: "#f5f3ef",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 140,
            top: -40,
            width: 90,
            height: 760,
            background: "#d64050",
            transform: "skewX(-20deg)",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#91caff" }}>
          {site.hero.eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>{name}</div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#a6afc0" }}>
            {site.hero.headlineLines.join(" ")} {site.hero.headlineAccent}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
