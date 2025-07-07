import React, { useState } from "react";
import { crafts } from "./data/crafts";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "./services/apiService";
import logo from "./logo.svg";

function ChatPanel({ artisan, mobile }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hi! Ask me anything about "${
        artisan.artisan_profile?.name || "this artisan"
      }".`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reasoningIndex, setReasoningIndex] = useState(0);
  const reasoningTexts = [
    "Thinking about your question…",
    "Consulting the craft experts…",
    "Gathering materials and ideas…",
    "Stitching together an answer…",
    "Glazing the perfect response…",
    "Almost ready with your answer…",
  ];
  React.useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setReasoningIndex((i) => (i + 1) % reasoningTexts.length);
      }, 900);
    } else {
      setReasoningIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);

    // Combine user question, artisan profile, and craft details into a single string
    const combinedContext = `Artisan Name: ${
      artisan.artisan_profile?.name || "-"
    }\nCity: ${artisan.artisan_profile?.location?.city || "-"}\nState: ${
      artisan.artisan_profile?.location?.state || "-"
    }\nCountry: ${artisan.artisan_profile?.location?.country || "-"}\nEmail: ${
      artisan.artisan_profile?.contact?.email || "-"
    }\nPhone: ${
      artisan.artisan_profile?.contact?.phone || "-"
    }\n\nCraft Category: ${
      artisan.craft_details?.craft_category || "-"
    }\nSubcategory: ${
      artisan.craft_details?.subcategory || "-"
    }\nCultural Heritage: ${
      artisan.craft_details?.cultural_heritage || "-"
    }\nPrimary Materials: ${
      (artisan.craft_details?.primary_materials || []).join(", ") || "-"
    }\nTechniques Used: ${
      (artisan.craft_details?.techniques_used || []).join(", ") || "-"
    }\nTools Used: ${
      (artisan.craft_details?.tools_used || []).join(", ") || "-"
    }
    \n\n
    Question: ${input}
    `;

    try {
      // Call OpenAI to answer the question about the craft
      const response = await apiService.answerCraftQuestion(combinedContext);

      if (response.success) {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "ai",
            text: response.data,
          },
        ]);
      } else {
        // Handle error by showing a message to the user
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "ai",
            text: "I'm sorry, I couldn't process your question. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Sorry, there was an error processing your question. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        borderLeft: "1.5px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        minWidth: 260,
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.2rem" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 12,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background:
                  msg.sender === "user"
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.04)",
                color: msg.sender === "user" ? "#fff" : "#fff",
                borderRadius: 10,
                padding: "0.5rem 0.9rem",
                fontSize: "1rem",
                maxWidth: 220,
                wordBreak: "break-word",
                boxShadow:
                  msg.sender === "user" ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div
            style={{
              margin: "32px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                borderRadius: 14,
                padding: "1.1rem 1.3rem",
                fontSize: "1.08rem",
                minWidth: 220,
                maxWidth: 260,
                boxShadow: "0 2px 16px rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontWeight: 500,
                letterSpacing: "-0.2px",
                border: "1.5px solid rgba(255,255,255,0.08)",
                marginBottom: 0,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  flex: 1,
                  animation: "wordFlashing 1.2s infinite linear alternate",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {reasoningTexts[reasoningIndex]}
              </span>
            </div>
            <style>{`
              @keyframes wordFlashing {
                0% { opacity: 0.4; }
                50% { opacity: 1; }
                100% { opacity: 0.4; }
              }
            `}</style>
          </div>
        )}
      </div>
      <div
        className="ludi-chat-input-row"
        style={{
          padding: "1.2rem 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: mobile ? "stretch" : "center",
          gap: mobile ? 0 : 0,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about materials, care, etc..."
          style={{
            width: mobile ? "100%" : "75%",
            minHeight: "38px",
            maxHeight: "120px",
            padding: "1.1rem 1.3rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            fontSize: "1rem",
            resize: "vertical",
            lineHeight: 1.5,
            outline: "none",
            fontFamily: "inherit",
            boxShadow: "none",
            marginBottom: mobile ? "10px" : 0,
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          style={{
            marginTop: mobile ? "0" : "1rem",
            marginLeft: mobile ? "0" : "1rem",
            background: loading
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 8,
            padding: "0.6rem 1.1rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s, color 0.2s",
            opacity: loading ? 0.7 : 1,
            width: mobile ? "100%" : undefined,
            alignSelf: mobile ? "stretch" : undefined,
          }}
          onMouseOver={(e) => {
            if (!loading)
              e.currentTarget.style.background = "rgba(255,255,255,0.22)";
          }}
          onMouseOut={(e) => {
            if (!loading)
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function CraftLightbox({ craft, onClose }) {
  if (!craft) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(10,10,15,0.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 40 }}
        transition={{ type: "spring", stiffness: 60 }}
        style={{
          background: "rgba(30,32,40,0.98)",
          borderRadius: 24,
          boxShadow: "0 8px 48px rgba(0,0,0,0.45)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          minWidth: 340,
          maxWidth: 420,
          width: "90vw",
          color: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={craft.image}
          alt={craft.name}
          style={{
            width: "100%",
            maxWidth: 320,
            height: 200,
            objectFit: "cover",
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 2px 16px rgba(0,0,0,0.7)",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.35rem",
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: "-0.5px",
            color: "#b6e0ff",
          }}
        >
          {craft.name}
        </div>
        <div
          style={{
            color: "#fff",
            fontWeight: 500,
            fontSize: "1.05rem",
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: "-0.2px",
          }}
        >
          {craft.creator} &middot; {craft.location}
        </div>
        <div
          style={{
            color: "#e0e0e0",
            fontSize: "1.05rem",
            marginBottom: 24,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {craft.description}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 10,
            padding: "0.7rem 1.5rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.7)",
            transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
            outline: "none",
            width: "100%",
            letterSpacing: "-0.2px",
          }}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function ArtisanProfileCard({ artisan }) {
  if (!artisan) return null;
  const profile = artisan.artisan_profile || {};
  const craft = artisan.craft_details || {};
  const photo =
    Array.isArray(craft.product_photos) && craft.product_photos.length > 0
      ? craft.product_photos[0]
      : null;

  return (
    <div
      className="ludi-focus-card"
      style={{
        background: "#18181b",
        borderRadius: 20,
        boxShadow: "0 6px 32px rgba(0,0,0,0.7)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1.5px solid rgba(255,255,255,0.08)",
        padding: "2.2rem 1.5rem 2rem 1.5rem",
        minWidth: 260,
        maxWidth: 360,
      }}
    >
      {photo && (
        <img
          src={photo}
          alt={profile.name}
          style={{
            width: "100%",
            maxWidth: 220,
            height: 140,
            objectFit: "cover",
            borderRadius: 14,
            marginBottom: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.7)",
            background: "rgba(255,255,255,0.04)",
          }}
        />
      )}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "#b6e0ff",
          marginBottom: 6,
        }}
      >
        {profile.name || "-"}
      </div>
      <div
        style={{
          color: "#fff",
          fontWeight: 500,
          fontSize: "1.05rem",
          marginBottom: 6,
        }}
      >
        {profile.location?.city || "-"}, {profile.location?.state || "-"},{" "}
        {profile.location?.country || "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Category:</b> {craft.craft_category || "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Subcategory:</b> {craft.subcategory || "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Cultural Heritage:</b> {craft.cultural_heritage || "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Materials:</b>{" "}
        {Array.isArray(craft.primary_materials) &&
        craft.primary_materials.length > 0
          ? craft.primary_materials.join(", ")
          : "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Techniques:</b>{" "}
        {Array.isArray(craft.techniques_used) &&
        craft.techniques_used.length > 0
          ? craft.techniques_used.join(", ")
          : "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Tools:</b>{" "}
        {Array.isArray(craft.tools_used) && craft.tools_used.length > 0
          ? craft.tools_used.join(", ")
          : "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem", marginBottom: 6 }}>
        <b>Email:</b> {profile.contact?.email || "-"}
      </div>
      <div style={{ color: "#e0e0e0", fontSize: "1.01rem" }}>
        <b>Phone:</b> {profile.contact?.phone || "-"}
      </div>
    </div>
  );
}

// Typing animation hook for input placeholder
function useTypingPlaceholder(examples, speed = 60, pause = 1200) {
  const [displayed, setDisplayed] = React.useState("");
  const [exampleIdx, setExampleIdx] = React.useState(0);
  const [charIdx, setCharIdx] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let timeout;
    const current = examples[exampleIdx];
    if (!isDeleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), speed);
    } else if (!isDeleting && charIdx === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
    } else if (isDeleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setExampleIdx((i) => (i + 1) % examples.length);
      }, 400);
    }
    setDisplayed(current.slice(0, charIdx) + (charIdx > 0 ? "|" : ""));
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, exampleIdx, examples, speed, pause]);

  return displayed;
}

export default function LandingPage() {
  const [email, setEmail] = React.useState("");
  const [formStatus, setFormStatus] = React.useState(null); // null | 'success' | 'error'
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [focusArtisan, setFocusArtisan] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchReasoningIndex, setSearchReasoningIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const examplePrompts = [
    "Ask Ludi to find a handwoven basket",
    "Find a ceramic artist near me",
    "Show me eco-friendly crafts",
    "Discover unique textile art",
    "Who makes wooden toys?",
    "Find a glassblower in my city",
    "Show me traditional jewelry makers",
  ];
  const searchReasoningTexts = [
    "Searching for the perfect crafts…",
    "Stitching together your results…",
    "Almost ready with your crafts…",
  ];
  const typingPlaceholder = useTypingPlaceholder(examplePrompts);
  // Pagination state (only one set)
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice(page * pageSize, (page + 1) * pageSize);

  // Responsive mobile state for focus view
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    let interval;
    if (searchLoading) {
      interval = setInterval(() => {
        setSearchReasoningIndex((i) => (i + 1) % searchReasoningTexts.length);
      }, 1000);
    } else {
      setSearchReasoningIndex(0);
    }
    return () => clearInterval(interval);
  }, [searchLoading]);

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearched(false);
    setFocusArtisan(null);
    try {
      const response = await apiService.searchArtisans(query);
      if (response.success && Array.isArray(response.data?.artisans)) {
        setResults(response.data.artisans);
      } else {
        setResults([]);
      }
      setSearched(true);
    } catch (error) {
      setResults([]);
      setSearched(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // Show hero until user submits a query
  if (!showSearch) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background:
            "radial-gradient(circle at 50% 70%, #ffb199 0%, #283e51 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "2.8rem",
              letterSpacing: "-1.5px",
              color: "#fff",
              marginBottom: 12,
              lineHeight: 1.1,
              textShadow: "0 2px 24px rgba(0,0,0,0.18)",
            }}
          >
            Find the crafts with{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#ffb199 0%,#ff0844 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ludi
            </span>
          </h1>
          <div
            style={{
              color: "#eaf6ff",
              fontWeight: 500,
              fontSize: "1.25rem",
              letterSpacing: "-0.5px",
              marginBottom: 18,
              opacity: 0.92,
            }}
          >
            Try it! It's magical!
          </div>
        </div>
        <div
          style={{
            background: "rgba(20,20,22,0.92)",
            borderRadius: 28,
            boxShadow: "0 8px 48px 0 rgba(0,0,0,0.45)",
            padding: "2.2rem 2.5rem 2rem 2.5rem",
            maxWidth: 600,
            width: "90vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                setShowSearch(true);
                handleSearch();
              }
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            <input
              type="text"
              placeholder={typingPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                fontSize: "1.18rem",
                padding: "1.1rem 1.3rem",
                borderRadius: 16,
                border: "none",
                background: "rgba(255,255,255,0.07)",
                color: "#fff",
                outline: "none",
                fontWeight: 500,
                boxShadow: "none",
                marginRight: 0,
                letterSpacing: "-0.2px",
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                marginLeft: 12,
                background: "linear-gradient(90deg,#ffb199 0%,#ff0844 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                fontSize: "1.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
                transition: "background 0.2s, color 0.2s, transform 0.1s",
              }}
              aria-label="Search"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 11H16M16 11L12.5 7.5M16 11L12.5 14.5"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          {/* <div
            style={{
              marginTop: 18,
              color: "#b6e0ff",
              fontSize: "1.01rem",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            <span style={{ fontWeight: 500 }}>+ Public</span>
          </div> */}
        </div>
      </div>
    );
  }

  // Focus mode UI from CraftSearch
  if (focusArtisan) {
    const CARD_WIDTH = 360;
    const CARD_HEIGHT = 540;
    return (
      <div
        className="ludi-focus-row"
        style={{
          minHeight: "100vh",
          width: "100vw",
          background:
            "radial-gradient(circle at 50% 70%, #ffb199 0%, #283e51 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "center",
          boxSizing: "border-box",
          position: "relative",
          padding: 0,
          gap: isMobile ? 0 : 36,
        }}
      >
        {/* LEFT: Artisan info card */}
        <div
          className="ludi-focus-card"
          style={{
            width: isMobile ? "100%" : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            marginBottom: isMobile ? 18 : 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArtisanProfileCard artisan={focusArtisan} />
        </div>
        {/* RIGHT: Chat panel */}
        <div
          className="ludi-focus-chat"
          style={{
            width: isMobile ? "100%" : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#18181b",
              borderRadius: 20,
              boxShadow: "0 6px 32px rgba(0,0,0,0.7)",
              width: "100%",
              height: isMobile ? "auto" : CARD_HEIGHT,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              border: "1.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <ChatPanel artisan={focusArtisan} mobile={isMobile} />
          </div>
        </div>
        <button
          onClick={() => setFocusArtisan(null)}
          style={{
            position: "absolute",
            left: 0,
            top: 32,
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "0 12px 12px 0",
            padding: "0.7rem 1.2rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.22)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
        >
          ← Back
        </button>
      </div>
    );
  }

  // Main search UI with pagination and join section at the bottom
  return (
    <>
      {/* Modern Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: 68,
          background: "#0a0a0f",
          color: "#b6e0ff",
          fontWeight: 900,
          fontSize: "2rem",
          letterSpacing: "-1.5px",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: "0 2px 16px 0 rgba(20,30,60,0.18)",
          borderBottom: "1px solid #23242a",
          padding: "0 0 0 40px",
        }}
      >
        <span
          style={{
            background: "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            fontSize: "2rem",
            letterSpacing: "-1.5px",
            lineHeight: 1,
          }}
        >
          Ludi
        </span>
        <style>{`
          @media (max-width: 600px) {
            header {
              height: 54px !important;
              padding-left: 16px !important;
            }
            header span {
              font-size: 1.3rem !important;
            }
          }
        `}</style>
      </header>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background:
            "radial-gradient(circle at 50% 70%, #ffb199 0%, #283e51 100%)",
          color: "#eaf6ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "80px 0 4rem 0",
        }}
      >
        <style>{`
          @media (max-width: 600px) {
            .ludi-main-title {
              font-size: 1.5rem !important;
              margin-bottom: 1.2rem !important;
              text-align: left !important;
              padding-left: 8px;
            }
            .ludi-search-box {
              padding: 1.2rem 0.7rem 1rem 0.7rem !important;
              max-width: 98vw !important;
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .ludi-search-box textarea {
              width: 100% !important;
              font-size: 1rem !important;
              margin-right: 0 !important;
              min-height: 38px !important;
            }
            .ludi-search-box .ludi-search-btn {
              width: 48px !important;
              height: 48px !important;
              border-radius: 50% !important;
              margin: 12px auto 0 auto !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 1.5rem !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.7);
            }
            .ludi-search-box .ludi-search-btn span {
              transform: none !important;
              font-size: 1.5rem !important;
            }
            .ludi-craft-grid {
              grid-template-columns: 1fr !important;
              gap: 18px !important;
              min-height: 0 !important;
              padding: 0 2vw !important;
            }
            .ludi-focus-row {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 0 !important;
              padding: 0 0 24px 0 !important;
              min-height: 0 !important;
              height: auto !important;
            }
            .ludi-focus-card, .ludi-focus-chat {
              width: 100% !important;
              max-width: 98vw !important;
              height: auto !important;
              min-width: 0 !important;
              min-height: 0 !important;
              box-sizing: border-box !important;
              border-radius: 16px !important;
              padding: 1.2rem 0.7rem 1.2rem 0.7rem !important;
            }
            .ludi-focus-card {
              margin-bottom: 10px !important;
              box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
            }
            .ludi-focus-chat {
              min-width: 0 !important;
              min-height: 0 !important;
              box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
            }
            .ludi-focus-chat textarea {
              width: 100% !important;
              min-height: 38px !important;
              font-size: 1rem !important;
            }
            .ludi-focus-chat button {
              width: 100% !important;
              margin-top: 10px !important;
              height: 40px !important;
              font-size: 1.1rem !important;
            }
            /* Divider between card and chat */
            .ludi-focus-divider {
              width: 100% !important;
              height: 1.5px !important;
              background: rgba(255,255,255,0.10) !important;
              margin: 16px 0 !important;
              border-radius: 2px !important;
              opacity: 0.18 !important;
              display: block !important;
            }
            /* ChatPanel header and close button */
            .ludi-chat-header {
              font-size: 1rem !important;
              padding: 1rem 1rem 0.4rem 1rem !important;
            }
            .ludi-chat-close-btn {
              font-size: 1.5rem !important;
              top: 8px !important;
              right: 10px !important;
            }
            .ludi-chat-input-row {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 0 !important;
            }
            .ludi-chat-input-row button {
              width: 100% !important;
              margin-top: 0 !important;
              height: 40px !important;
              font-size: 1.1rem !important;
              align-self: stretch !important;
            }
          }
        `}</style>
        <h1
          className="ludi-main-title"
          style={{
            fontSize: "2.7rem",
            marginBottom: "2.5rem",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          What craft are you looking for?
        </h1>
        <div
          className="ludi-search-box"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "16px",
            padding: "2.2rem 2.5rem 2rem 2.5rem",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <textarea
            placeholder="Describe what you want, e.g. a cozy, hand-knitted item..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "80%",
              minHeight: "56px",
              maxHeight: "160px",
              padding: "1.1rem 1.3rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: "1.1rem",
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.5,
              fontFamily: "inherit",
              boxShadow: "none",
              marginRight: "1.2rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
              }
            }}
            disabled={searchLoading}
          />
          <button
            className="ludi-search-btn"
            onClick={handleSearch}
            style={{
              background: searchLoading
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor: searchLoading ? "not-allowed" : "pointer",
              fontSize: "1.7rem",
              verticalAlign: "middle",
              transition: "background 0.2s, color 0.2s, transform 0.1s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: searchLoading ? 0.7 : 1,
              marginTop: 0,
            }}
            onMouseOver={(e) => {
              if (!searchLoading)
                e.currentTarget.style.background = "rgba(255,255,255,0.22)";
            }}
            onMouseOut={(e) => {
              if (!searchLoading)
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseDown={(e) => {
              if (!searchLoading)
                e.currentTarget.style.transform = "scale(0.93)";
            }}
            onMouseUp={(e) => {
              if (!searchLoading) e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              if (!searchLoading) e.currentTarget.style.transform = "scale(1)";
            }}
            disabled={searchLoading}
            aria-label="Search"
          >
            {/* Modern right arrow icon (SVG) */}
            <span style={{ display: "inline-block", transform: "none" }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 11H16M16 11L12.5 7.5M16 11L12.5 14.5"
                  stroke="#b6e0ff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
        {searchLoading && (
          <div
            style={{
              margin: "38px 0 0 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                borderRadius: 16,
                padding: "1.2rem 1.6rem",
                fontSize: "1.13rem",
                minWidth: 260,
                maxWidth: 340,
                boxShadow: "0 2px 18px rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                border: "1.5px solid rgba(255,255,255,0.08)",
                marginBottom: 0,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  flex: 1,
                  animation: "wordFlashing 1.2s infinite linear alternate",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {searchReasoningTexts[searchReasoningIndex]}
              </span>
            </div>
            <style>{`
              @keyframes wordFlashing {
                0% { opacity: 0.4; }
                50% { opacity: 1; }
                100% { opacity: 0.4; }
              }
            `}</style>
          </div>
        )}
        {searched && !searchLoading && (
          <div
            style={{
              marginTop: "1.5rem",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: 24,
              paddingRight: 24,
              boxSizing: "border-box",
            }}
          >
            {pagedResults.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  padding: "2.5rem 0",
                  opacity: 0.85,
                  letterSpacing: "-0.5px",
                  minHeight: 180,
                  transition: "opacity 0.3s",
                }}
              >
                <span style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</span>
                <span>No artisans found.</span>
                <span
                  style={{
                    color: "black",
                    fontWeight: 400,
                    fontSize: "1rem",
                    marginTop: 8,
                  }}
                >
                  Try a different search or check your spelling.
                </span>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxSizing: "border-box",
                    paddingLeft: 8,
                    paddingRight: 8,
                  }}
                >
                  <table
                    style={{
                      minWidth: 900,
                      width: "100%",
                      background: "rgba(20,20,30,0.85)",
                      backdropFilter: "blur(6px)",
                      borderRadius: 18,
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                      color: "#fff",
                      fontSize: "1.05rem",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          fontWeight: 800,
                          letterSpacing: "-0.5px",
                          fontSize: "1.08rem",
                          textShadow: "0 1px 8px rgba(0,0,0,0.10)",
                        }}
                      >
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Subcategory
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Cultural Heritage
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Primary Materials
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Techniques Used
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Tools Used
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          Product Photos
                        </th>
                        <th
                          style={{
                            padding: "0.9rem 0.7rem",
                            textAlign: "left",
                          }}
                        >
                          AI
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedResults.map((artisan, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background:
                              idx % 2 === 0
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(255,255,255,0.01)",
                            transition: "background 0.2s, box-shadow 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              "rgba(102,204,255,0.10)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 12px rgba(102,204,255,0.10)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              idx % 2 === 0
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(255,255,255,0.01)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {artisan.artisan_profile?.name || "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {artisan.craft_details?.craft_category || "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {artisan.craft_details?.subcategory || "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {artisan.craft_details?.cultural_heritage || "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {Array.isArray(
                              artisan.craft_details?.primary_materials
                            ) &&
                            artisan.craft_details.primary_materials.length > 0
                              ? artisan.craft_details.primary_materials.join(
                                  ", "
                                )
                              : "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {Array.isArray(
                              artisan.craft_details?.techniques_used
                            ) &&
                            artisan.craft_details.techniques_used.length > 0
                              ? artisan.craft_details.techniques_used.join(", ")
                              : "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {Array.isArray(artisan.craft_details?.tools_used) &&
                            artisan.craft_details.tools_used.length > 0
                              ? artisan.craft_details.tools_used.join(", ")
                              : "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            {Array.isArray(
                              artisan.craft_details?.product_photos
                            ) && artisan.craft_details.product_photos.length > 0
                              ? artisan.craft_details.product_photos.length +
                                " photo(s)"
                              : "-"}
                          </td>
                          <td style={{ padding: "0.8rem 0.7rem" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusArtisan(artisan);
                              }}
                              style={{
                                background:
                                  "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)",
                                color: "#0a0a0f",
                                border: "none",
                                borderRadius: 10,
                                padding: "0.5rem 1.1rem",
                                fontWeight: 700,
                                fontSize: "1rem",
                                cursor: "pointer",
                                boxShadow: "0 1px 4px rgba(97,218,251,0.10)",
                                transition:
                                  "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s",
                                outline: "none",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background =
                                  "linear-gradient(90deg,#b6e0ff 0%,#61dafb 100%)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background =
                                  "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)";
                              }}
                              onMouseDown={(e) => {
                                e.currentTarget.style.transform = "scale(0.96)";
                              }}
                              onMouseUp={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              Chat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 22,
                    marginTop: 32,
                  }}
                >
                  <button
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    style={{
                      background:
                        page === 0
                          ? "linear-gradient(90deg,#23242a 0%,#23242a 100%)"
                          : "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)",
                      color: page === 0 ? "#888" : "#0a0a0f",
                      border: "none",
                      borderRadius: 18,
                      padding: "0.7rem 1.7rem",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      boxShadow:
                        page === 0
                          ? "none"
                          : "0 2px 12px rgba(97,218,251,0.10)",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s",
                      outline: "none",
                      opacity: page === 0 ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (page !== 0)
                        e.currentTarget.style.background =
                          "linear-gradient(90deg,#b6e0ff 0%,#61dafb 100%)";
                    }}
                    onMouseOut={(e) => {
                      if (page !== 0)
                        e.currentTarget.style.background =
                          "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)";
                    }}
                  >
                    Previous
                  </button>
                  <div
                    style={{
                      color: "black",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    Page {page + 1} of {totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages - 1, prev + 1))
                    }
                    disabled={page === totalPages - 1}
                    style={{
                      background:
                        page === totalPages - 1
                          ? "linear-gradient(90deg,#23242a 0%,#23242a 100%)"
                          : "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)",
                      color: page === totalPages - 1 ? "#888" : "#0a0a0f",
                      border: "none",
                      borderRadius: 18,
                      padding: "0.7rem 1.7rem",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      cursor:
                        page === totalPages - 1 ? "not-allowed" : "pointer",
                      boxShadow:
                        page === totalPages - 1
                          ? "none"
                          : "0 2px 12px rgba(97,218,251,0.10)",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s",
                      outline: "none",
                      opacity: page === totalPages - 1 ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (page !== totalPages - 1)
                        e.currentTarget.style.background =
                          "linear-gradient(90deg,#b6e0ff 0%,#61dafb 100%)";
                    }}
                    onMouseOut={(e) => {
                      if (page !== totalPages - 1)
                        e.currentTarget.style.background =
                          "linear-gradient(90deg,#61dafb 0%,#b6e0ff 100%)";
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Join section at the bottom */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "2.5rem 0 2.5rem 0",
          }}
        >
          <div
            style={{
              background: "rgba(20,20,30,0.97)",
              borderRadius: 28,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: "2.2rem 2.5rem 2rem 2.5rem",
              maxWidth: 480,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <h2
              style={{
                color: "#b6e0ff",
                fontWeight: 700,
                fontSize: "1.35rem",
                marginBottom: 18,
                letterSpacing: "-0.5px",
                textAlign: "center",
              }}
            >
              Be the first to know what's coming
            </h2>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: 12,
                marginBottom: 16,
              }}
              onSubmit={async (e) => {
                e.preventDefault();
                setFormStatus(null);
                try {
                  const formData = new FormData();
                  formData.append("entry.1354930904", email);
                  const response = await fetch(
                    "https://docs.google.com/forms/d/e/1FAIpQLSdvzgrDpC2DMuyyk24XwcNYZNS8fuu7JyEykfI6F8dEeIENNw/formResponse",
                    {
                      method: "POST",
                      mode: "no-cors",
                      body: formData,
                    }
                  );
                  setFormStatus("success");
                  setEmail("");
                } catch (err) {
                  setFormStatus("error");
                }
              }}
            >
              <label htmlFor="ludi-email" style={{ display: "none" }}>
                Email
              </label>
              <div style={{ display: "flex", width: "100%", gap: 8 }}>
                <input
                  id="ludi-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.7rem 1.1rem",
                    borderRadius: 10,
                    border: "2px solid #0099ff",
                    fontSize: "1.08rem",
                    outline: "none",
                    background: "#fff",
                    color: "#222",
                    fontWeight: 500,
                  }}
                  disabled={formStatus === "success"}
                />
                <button
                  type="submit"
                  style={{
                    background:
                      formStatus === "success"
                        ? "#e0e0e0"
                        : "linear-gradient(90deg,#0099ff 0%,#61dafb 100%)",
                    color: formStatus === "success" ? "#888" : "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "0.7rem 1.7rem",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    cursor:
                      formStatus === "success" ? "not-allowed" : "pointer",
                    boxShadow:
                      formStatus === "success"
                        ? "none"
                        : "0 2px 12px rgba(0,153,255,0.10)",
                    letterSpacing: "-0.2px",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    opacity: formStatus === "success" ? 0.7 : 1,
                  }}
                  disabled={formStatus === "success"}
                >
                  {formStatus === "success" ? "Joined!" : "Join Now"}
                </button>
              </div>
              {formStatus === "success" && (
                <div
                  style={{
                    color: "#4caf50",
                    marginTop: 10,
                    fontWeight: 500,
                    fontSize: "1.01rem",
                    textAlign: "center",
                  }}
                >
                  Thank you for joining! You'll receive early updates soon.
                </div>
              )}
              {formStatus === "error" && (
                <div
                  style={{
                    color: "#ff5252",
                    marginTop: 10,
                    fontWeight: 500,
                    fontSize: "1.01rem",
                    textAlign: "center",
                  }}
                >
                  Something went wrong. Please try again later.
                </div>
              )}
            </form>
            <div
              style={{
                color: "#b6e0ff",
                fontSize: "1.01rem",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Let's redefine how the world values knowledge.
            </div>
          </div>
        </div>
        <footer
          style={{
            width: "100%",
            textAlign: "center",
            color: "#b6e0ff",
            fontSize: "0.98rem",
            marginTop: 24,
            opacity: 0.85,
          }}
        >
          ©️ 2025 useludi.org— All rights reserved.
        </footer>
      </div>
    </>
  );
}
