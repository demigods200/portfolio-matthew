import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Matthew Wu — Senior Software Engineer, Full Stack & AI Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0c0b0f",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: availability badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#16a34a",
            }}
          />
          <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: 500 }}>
            Available for senior roles
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#f2f0f7",
            }}
          >
            I turn AI capabilities into
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#818cf8",
            }}
          >
            reliable product systems.
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#9b94b3",
              marginTop: "8px",
              lineHeight: 1.5,
            }}
          >
            Senior Software Engineer at Atlassian (Loom) — LLM pipelines,
            hybrid search, real-time AI.
          </div>
        </div>

        {/* Bottom: metrics row */}
        <div style={{ display: "flex", gap: "48px", alignItems: "flex-end" }}>
          {[
            { value: "8+", label: "Years shipping product" },
            { value: "3", label: "AI pipelines in production" },
            { value: "<500ms", label: "Streaming start latency" },
          ].map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "28px", fontWeight: 600, color: "#f2f0f7", fontVariantNumeric: "tabular-nums" }}>
                {m.value}
              </span>
              <span style={{ fontSize: "13px", color: "#635d7a" }}>{m.label}</span>
            </div>
          ))}

          {/* Right: name */}
          <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#f2f0f7" }}>Matthew Wu</span>
            <span style={{ fontSize: "13px", color: "#635d7a" }}>matthewjwu93@gmail.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
