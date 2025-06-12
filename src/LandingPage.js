import React, { useState } from "react";
import { crafts } from "./data/crafts";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "./services/apiService";
import logo from "./logo.svg";

function ChatPanel({ craft, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: `Hi! Ask me anything about \"${craft.name}\".` },
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

    try {
      // Call OpenAI to answer the question about the craft
      const response = await apiService.answerCraftQuestion(input, craft);

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
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          zIndex: 2,
        }}
        title="Close chat"
      >
        ×
      </button>
      <div
        style={{
          padding: "1.2rem 1.2rem 0.5rem 1.2rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#fff",
        }}
      >
        Ask AI about this craft
      </div>
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
        style={{
          padding: "0.7rem 1.2rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          width: "100%",
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
            width: "75%",
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
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          style={{
            marginTop: "1rem",
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

export default function LandingPage() {
  const [email, setEmail] = React.useState("");
  const [formStatus, setFormStatus] = React.useState(null); // null | 'success' | 'error'
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [focusCraft, setFocusCraft] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchReasoningIndex, setSearchReasoningIndex] = useState(0);
  const searchReasoningTexts = [
    "Searching for the perfect crafts…",
    "Stitching together your results…",
    "Almost ready with your crafts…",
  ];
  // Pagination state (only one set)
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice(page * pageSize, (page + 1) * pageSize);

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

  const handleSearch = () => {
    setSearchLoading(true);
    // You can add filtering logic here if needed
    // Shuffle crafts array
    const shuffled = crafts.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTimeout(() => {
      setResults(shuffled);
      setSearched(true);
      setFocusCraft(null);
      setShowChat(true);
      setPage(0);
      setSearchLoading(false);
    }, 2000);
  };

  // Focus mode UI from CraftSearch
  if (focusCraft) {
    const CARD_WIDTH = 360;
    const CARD_HEIGHT = 540;
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          position: "relative",
          padding: 0,
          gap: 36,
        }}
      >
        <div
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 20,
              boxShadow: "0 6px 32px rgba(0,0,0,0.7)",
              padding: "2.2rem 2rem 2rem 2rem",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              border: "1.5px solid rgba(255,255,255,0.08)",
              transition: "box-shadow 0.2s",
            }}
          >
            <img
              src={focusCraft.image}
              alt={focusCraft.name}
              style={{
                width: "100%",
                maxWidth: 220,
                height: 150,
                objectFit: "cover",
                borderRadius: 14,
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
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {focusCraft.name}
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
              {focusCraft.creator} &middot; {focusCraft.location}
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: "1.05rem",
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {focusCraft.description}
            </div>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => {
                setFocusCraft(null);
              }}
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
        </div>
        {/* Divider */}
        <div
          style={{
            height: CARD_HEIGHT,
            width: 1,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 2,
            opacity: 0.13,
            margin: "0 18px",
          }}
        />
        {showChat && (
          <div
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 20,
                boxShadow: "0 6px 32px rgba(0,0,0,0.7)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid rgba(255,255,255,0.08)",
              }}
            >
              <ChatPanel
                craft={focusCraft}
                onClose={() => setShowChat(false)}
              />
            </div>
          </div>
        )}
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            style={{
              position: "absolute",
              right: 0,
              top: 32,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px 0 0 12px",
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
            AI Chat
          </button>
        )}
      </div>
    );
  }

  // Main search UI with pagination and join section at the bottom
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 0 4rem 0",
      }}
    >
      <h1
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
            if (!searchLoading) e.currentTarget.style.transform = "scale(0.93)";
          }}
          onMouseUp={(e) => {
            if (!searchLoading) e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            if (!searchLoading) e.currentTarget.style.transform = "scale(1)";
          }}
          disabled={searchLoading}
        >
          <span
            style={{ display: "inline-block", transform: "rotate(-45deg)" }}
          >
            ↑
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
            maxWidth: "900px",
          }}
        >
          {pagedResults.length === 0 ? (
            <div
              style={{
                color: "#bbb",
                fontStyle: "italic",
                padding: "1.5rem 0",
              }}
            >
              No crafts found.
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 38,
                  background: "none",
                  padding: 0,
                  minHeight: 420,
                }}
              >
                {pagedResults.map((craft) => (
                  <div
                    key={craft.id}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      cursor: "pointer",
                      overflow: "hidden",
                      borderRadius: 14,
                      background: "none",
                      boxShadow: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      transition: "box-shadow 0.2s",
                    }}
                    onClick={() => {
                      setFocusCraft(craft);
                      setShowChat(true);
                    }}
                  >
                    <img
                      src={craft.image}
                      alt={craft.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 14,
                        display: "block",
                        background: "#222",
                      }}
                    />
                  </div>
                ))}
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
                    background: page === 0 ? "#333" : "rgba(255,255,255,0.12)",
                    color: page === 0 ? "#777" : "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 10,
                    padding: "0.7rem 1.5rem",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    boxShadow:
                      page === 0 ? "none" : "0 1px 4px rgba(0,0,0,0.7)",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    outline: "none",
                  }}
                  onMouseOver={(e) => {
                    if (page !== 0)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.22)";
                  }}
                  onMouseOut={(e) => {
                    if (page !== 0)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.12)";
                  }}
                >
                  Previous
                </button>
                <div
                  style={{
                    color: "#aaa",
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
                        ? "#333"
                        : "rgba(255,255,255,0.12)",
                    color: page === totalPages - 1 ? "#777" : "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 10,
                    padding: "0.7rem 1.5rem",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                    boxShadow:
                      page === totalPages - 1
                        ? "none"
                        : "0 1px 4px rgba(0,0,0,0.7)",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    outline: "none",
                  }}
                  onMouseOver={(e) => {
                    if (page !== totalPages - 1)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.22)";
                  }}
                  onMouseOut={(e) => {
                    if (page !== totalPages - 1)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.12)";
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
            background: "rgba(255,255,255,0.10)",
            borderRadius: 22,
            boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
            padding: "2rem 2rem 1.5rem 2rem",
            maxWidth: 480,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            Leave your email to be the first to know what's coming
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
                  borderRadius: 8,
                  border: "1px solid #b6e0ff",
                  fontSize: "1rem",
                  outline: "none",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: 500,
                }}
                disabled={formStatus === "success"}
              />
              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)",
                  color: "#0a0a0f",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.7rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: formStatus === "success" ? "not-allowed" : "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  letterSpacing: "-0.2px",
                  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                  opacity: formStatus === "success" ? 0.6 : 1,
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
  );
}
