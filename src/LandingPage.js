import React from "react";
import { crafts } from "./data/crafts";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./logo.svg";

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
  const [lightboxCraft, setLightboxCraft] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(crafts.length / pageSize);
  const pagedCrafts = crafts.slice(page * pageSize, (page + 1) * pageSize);
  const [email, setEmail] = React.useState("");
  const [formStatus, setFormStatus] = React.useState(null); // null | 'success' | 'error'
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
          padding: "2.5rem 0 1.2rem 0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.1rem",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "0.5rem",
            background: "none",
            color: "#b6e0ff",
            WebkitBackgroundClip: "unset",
            WebkitTextFillColor: "unset",
          }}
        >
          Craft is our Code
        </h1>
        <p
          style={{
            color: "#e0e0e0",
            fontSize: "1.08rem",
            maxWidth: 480,
            margin: "0 auto",
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          A global movement to empower artisan communities through ethical AI.
        </p>
      </header>

      <section
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          marginTop: 32,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 38,
            background: "none",
            padding: 0,
            minHeight: 420,
          }}
        >
          <AnimatePresence mode="wait">
            {pagedCrafts.map((craft) => (
              <motion.div
                key={craft.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.38, type: "spring", stiffness: 60 }}
                whileHover={{ scale: 1.06, zIndex: 2 }}
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
                onClick={() => setLightboxCraft(craft)}
              >
                <motion.img
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
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.22 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            style={{
              background:
                page === 0
                  ? "linear-gradient(90deg, #222 0%, #333 100%)"
                  : "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)",
              color: page === 0 ? "#888" : "#0a0a0f",
              border: "none",
              borderRadius: 999,
              padding: "0.8rem 2.2rem",
              fontWeight: 700,
              fontSize: "1.08rem",
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.5 : 1,
              boxShadow:
                page === 0 ? "none" : "0 2px 12px rgba(97,218,251,0.13)",
              letterSpacing: "-0.2px",
              transition: "background 0.2s, color 0.2s, opacity 0.2s",
            }}
            onMouseOver={(e) => {
              if (page !== 0)
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #b6e0ff 0%, #61dafb 100%)";
            }}
            onMouseOut={(e) => {
              if (page !== 0)
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)";
            }}
          >
            Previous
          </button>
          <span
            style={{
              color: "#b6e0ff",
              fontWeight: 600,
              fontSize: "1.08rem",
              letterSpacing: "0.2px",
              minWidth: 60,
              textAlign: "center",
            }}
          >
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            style={{
              background:
                page >= totalPages - 1
                  ? "linear-gradient(90deg, #222 0%, #333 100%)"
                  : "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)",
              color: page >= totalPages - 1 ? "#888" : "#0a0a0f",
              border: "none",
              borderRadius: 999,
              padding: "0.8rem 2.2rem",
              fontWeight: 700,
              fontSize: "1.08rem",
              cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page >= totalPages - 1 ? 0.5 : 1,
              boxShadow:
                page >= totalPages - 1
                  ? "none"
                  : "0 2px 12px rgba(97,218,251,0.13)",
              letterSpacing: "-0.2px",
              transition: "background 0.2s, color 0.2s, opacity 0.2s",
            }}
            onMouseOver={(e) => {
              if (page < totalPages - 1)
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #b6e0ff 0%, #61dafb 100%)";
            }}
            onMouseOut={(e) => {
              if (page < totalPages - 1)
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #61dafb 0%, #b6e0ff 100%)";
            }}
          >
            Next
          </button>
        </div>
      </section>
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
            Join the Ludi Circle
          </h2>
          <p
            style={{
              color: "#e0e0e0",
              fontSize: "1.08rem",
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            Be part of a living platform that bridges ancestral knowledge and
            AI. Enter your email to receive early updates and become a founding
            ally.
          </p>
          <p
            style={{
              color: "#e0e0e0",
              fontSize: "1.08rem",
              textAlign: "center",
              marginBottom: 18,
            }}
          ></p>
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
      <AnimatePresence>
        {lightboxCraft && (
          <CraftLightbox
            craft={lightboxCraft}
            onClose={() => setLightboxCraft(null)}
          />
        )}
      </AnimatePresence>
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
