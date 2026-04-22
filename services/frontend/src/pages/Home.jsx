import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Globe, Shield, TrendingUp } from "lucide-react";
import HeroSection from "../components/HeroSection";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <Zap size={24} />,
    title: "Lightning Fast",
    desc: "Microservices architecture ensures blazing fast order processing.",
    color: "#ffd700",
    gradient: "linear-gradient(135deg, #ffd700, #ff9a00)",
  },
  {
    icon: <Globe size={24} />,
    title: "Always Available",
    desc: "99.9% uptime guaranteed with Kubernetes auto-scaling.",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6c63ff)",
  },
  {
    icon: <Shield size={24} />,
    title: "Secure & Safe",
    desc: "JWT authentication with end-to-end encrypted transactions.",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Smart Delivery",
    desc: "AI-powered route optimization for the fastest delivery.",
    color: "#ff6b35",
    gradient: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
  },
];

const cuisines = [
  { name: "Italian", emoji: "🍕", color: "#ff6b35" },
  { name: "Japanese", emoji: "🍣", color: "#e11d48" },
  { name: "Mexican", emoji: "🌮", color: "#f97316" },
  { name: "Chinese", emoji: "🍜", color: "#eab308" },
  { name: "Indian", emoji: "🍛", color: "#ff6b35" },
  { name: "American", emoji: "🍔", color: "#22c55e" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <HeroSection />

      <section style={{ padding: "100px 24px", background: "#0f0f1a" }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 50,
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.3)",
                color: "#ff6b35",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              WHY KUBEKITCHEN
            </span>
            <h2
              style={{
                fontSize: "2.5rem",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              Built for the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Future
              </span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 28,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    background: f.gradient,
                    borderRadius: 14,
                    padding: 12,
                    display: "inline-flex",
                    marginBottom: 16,
                    color: "white",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #1a0a2e, #0a1628)",
        }}
      >
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2 style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
              Explore Cuisines
            </h2>
          </motion.div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {cuisines.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.1, y: -4 }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>{c.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section style={{ padding: "100px 24px", background: "#0f0f1a", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="page-container"
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              Ready to Order?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: 36 }}>
              Join thousands of food lovers on KubeKitchen
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  style={{ fontSize: "1rem", padding: "14px 36px" }}
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;