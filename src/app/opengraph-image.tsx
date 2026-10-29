import { ImageResponse } from "next/og";

export const alt = "Surabaya Drive — Rental mobil di Surabaya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0f766e",
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            🚗
          </div>
          <div style={{ fontSize: "64px", fontWeight: 700 }}>
            Surabaya Drive
          </div>
        </div>
        <div
          style={{
            fontSize: "32px",
            marginTop: "24px",
            color: "#ccfbf1",
          }}
        >
          Rental mobil di Surabaya — lepas kunci atau dengan sopir.
        </div>
      </div>
    ),
    { ...size },
  );
}
