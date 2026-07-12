"use client";

/** Route error boundary — keeps a human-readable page if anything throws. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>משהו השתבש רגע.</h1>
        <p style={{ color: "#a39e93", marginBottom: "24px" }}>
          רעננו את הדף, או התקשרו אלינו: <a href="tel:+972545955580" style={{ color: "#ffb45e" }}>054-5955580</a>
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: "999px",
            border: "none",
            background: "#e39a3b",
            color: "#17110a",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          נסו שוב
        </button>
      </div>
    </main>
  );
}
