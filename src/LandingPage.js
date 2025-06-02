import React from "react";
import { crafts } from "./data/crafts";

const features = [
  {
    title: "The Living Archive",
    description:
      "Our platform features a rich, structured database of rare and disappearing crafts, gathered directly from rural villages around the world. We document and digitize these traditions—many of which have never been recorded online—capturing not just how a craft is made, but its cultural roots and materials used. This becomes a living archive preserving ancestral knowledge for future generations.",
  },
  {
    title: "Intelligent Discovery Engine",
    description:
      "Users often don't know the right keywords to search for traditional crafts. Our system leverages LLMs to understand natural language and intent, enabling users to search conversationally. Whether describing a technique visually or emotionally, users are matched with relevant crafts through AI-powered semantic reasoning.",
  },
  {
    title: "Interactive AI Guide",
    description:
      "Each craft entry comes with an embedded AI companion that explains the meaning, story, and steps behind the tradition. From cultural significance to hands-on instructions, users are guided through the entire learning journey—like having a local artisan by your side. The tutorials adapt to your skill level and materials, making learning accessible and personal.",
  },
  {
    title: "Craft Community Matching",
    description:
      "We use LLM-powered profiling to connect users with others who share their passion—whether they're educators, artisans, museum curators, or local event organizers. By understanding each user's interests and background, the platform fosters meaningful connections and builds a global community around traditional crafts and cultural preservation.",
  },
];

function AnimatedCollage() {
  // Show a subset of images at a time, animate cycling through them
  const [startIdx, setStartIdx] = React.useState(0);
  const visibleCount = 7;
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStartIdx((idx) => (idx + 1) % crafts.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);
  const visible = [];
  for (let i = 0; i < visibleCount; i++) {
    visible.push(crafts[(startIdx + i) % crafts.length]);
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        justifyContent: "center",
        alignItems: "end",
        flexWrap: "wrap",
        margin: "2.5rem 0 2.5rem 0",
        minHeight: 180,
        transition: "all 0.7s cubic-bezier(.7,.2,.2,1)",
      }}
    >
      {visible.map((craft, i) => (
        <div
          key={craft.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0.92,
            transform: `scale(${
              i === Math.floor(visibleCount / 2) ? 1.13 : 1
            })`,
            transition:
              "transform 0.7s cubic-bezier(.7,.2,.2,1), opacity 0.7s cubic-bezier(.7,.2,.2,1)",
          }}
        >
          <img
            src={craft.image}
            alt={craft.name}
            style={{
              width: 90 + (i === Math.floor(visibleCount / 2) ? 30 : 0),
              height: 60 + (i === Math.floor(visibleCount / 2) ? 20 : 0),
              objectFit: "cover",
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              border:
                i === Math.floor(visibleCount / 2)
                  ? "2.5px solid #fff"
                  : "1.5px solid #eee",
              marginBottom: 8,
              background: "#222",
              transition: "all 0.7s cubic-bezier(.7,.2,.2,1)",
            }}
          />
          <span
            style={{
              color: i === Math.floor(visibleCount / 2) ? "#fff" : "#eee",
              fontWeight: 600,
              fontSize:
                i === Math.floor(visibleCount / 2) ? "1.08rem" : "0.98rem",
              letterSpacing: "-0.2px",
              textShadow: "0 1px 4px rgba(0,0,0,0.18)",
              marginBottom: 2,
              transition: "all 0.7s cubic-bezier(.7,.2,.2,1)",
            }}
          >
            {craft.creator}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #0a0a0f 0%, #1a1a22 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 0 4rem 0",
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "3.5rem 0 1.5rem 0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: "0.7rem",
            background: "linear-gradient(90deg, #fff 60%, #b6e0ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ludi
        </h1>
        <h2
          style={{
            fontSize: "1.45rem",
            fontWeight: 500,
            color: "#b6e0ff",
            letterSpacing: "-0.5px",
            marginBottom: "0.5rem",
          }}
        >
          The Living Archive of World Crafts
        </h2>
        <p
          style={{
            color: "#e0e0e0",
            fontSize: "1.13rem",
            maxWidth: 540,
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          Preserving, discovering, and celebrating the world's rarest
          crafts—powered by AI, guided by community.
        </p>
      </header>
      <AnimatedCollage />
      <section
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 36,
          marginTop: 24,
          marginBottom: 32,
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
              padding: "2.1rem 2.1rem 1.5rem 2.1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              minHeight: 220,
              transition: "box-shadow 0.2s",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: 10,
                color: "#b6e0ff",
                letterSpacing: "-0.5px",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                color: "#e0e0e0",
                fontSize: "1.08rem",
                fontWeight: 400,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
