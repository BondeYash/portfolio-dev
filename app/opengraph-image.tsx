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
          background:
            "radial-gradient(circle at 12% 10%, #1d4ed8 0%, transparent 42%), radial-gradient(circle at 90% 80%, #7c3aed 0%, transparent 40%), #070b16",
          color: "#f4f4f5",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#a1a1a8" }}>
          {profile.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 46, lineHeight: 1.12, letterSpacing: -1.2 }}>
            {profile.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#4d8bff" }}>{profile.fullName}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
