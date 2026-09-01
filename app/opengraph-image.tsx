import { ImageResponse } from "next/og";
import { paper, profile } from "@/data/profile";

export const alt = `Yash Times - ${profile.fullName}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#ecdec3";
const INK = "#281d13";
const SPOT = "#9e3a1e";
const MUTED = "#584f40";

/**
 * Satori only ships a basic Latin face and will try to fetch a font for
 * anything outside it, which fails in a sandboxed build. Keep it ASCII.
 */
const ascii = (value: string) =>
  value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
          color: INK,
          padding: "44px 56px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>{ascii(paper.volume)}</span>
          <span style={{ color: SPOT }}>Late City Edition</span>
          <span>{ascii(paper.price)}</span>
        </div>

        <div
          style={{
            display: "flex",
            height: 4,
            backgroundColor: INK,
            marginTop: 12,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: -2,
            padding: "12px 0",
          }}
        >
          {ascii(paper.title)}
        </div>

        <div style={{ display: "flex", height: 4, backgroundColor: INK }} />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            padding: "10px 0",
          }}
        >
          <span>
            {ascii(paper.city)} | {ascii(paper.motto)}
          </span>
        </div>

        <div style={{ display: "flex", height: 8, backgroundColor: INK }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2,
            }}
          >
            <span>Engineer Ships Systems</span>
            <span>That Hold Under Load</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              marginTop: 20,
              color: MUTED,
              lineHeight: 1.3,
            }}
          >
            {ascii(profile.subheading)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${INK}`,
            paddingTop: 12,
            fontSize: 21,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>By {ascii(profile.fullName)}</span>
          <span style={{ color: SPOT }}>Turn the page &gt;&gt;</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
