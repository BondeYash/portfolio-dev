import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.fullName} | ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070b16",
          color: "#f4f4f5",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#93c5fd",
          }}
        >
          {profile.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 46, lineHeight: 1.12, letterSpacing: -1.2 }}>
            {profile.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#60a5fa" }}>{profile.fullName}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
