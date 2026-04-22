import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Shield } from "lucide-react";

const floatingEmojis = ["🍕", "🍜", "🍣", "🌮", "🍔", "🥗", "🍛", "🥩"];

const HeroSection = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(108,99,255,0.15) 0%, transparent 60%)",
        }}
      />

      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          style={{
            position: "absolute",
            fontSize: `${2 + (i % 3) * 0.5}rem`,
            opacity: 0.15,
            top: `${10 + (i * 11) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            filter: "blur(0px)",
            zIndex: 0,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.3)",
                borderRadius: 50,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "#ff6b35", fontWeight: 600 }}>
                🚀 Cloud-Native Food Delivery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Discover the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Best Food
              </span>{" "}
              in Town
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: "1.1rem", color: "#a0a0b8", marginBottom: 36, lineHeight: 1.7 }}
            >
              From top restaurants to your doorstep. Powered by microservices, built on Kubernetes.
              Experience food delivery redefined.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <Link to="/restaurants" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1rem", padding: "14px 32px" }}
                >
                  Order Now <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                  style={{ fontSize: "1rem", padding: "14px 32px" }}
                >
                  Join as Partner
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: "flex", gap: 32, marginTop: 48 }}
            >
              {[
                { icon: <Star size={18} />, label: "4.9 Rating", color: "#ffd700" },
                { icon: <Clock size={18} />, label: "30 min Delivery", color: "#3b82f6" },
                { icon: <Shield size={18} />, label: "Secure Orders", color: "#22c55e" },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span style={{ color: "#a0a0b8", fontSize: "0.9rem", fontWeight: 500 }}>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "flex", justifyContent: "center", position: "relative" }}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 380,
                height: 380,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,31,142,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,107,53,0.3)",
                position: "relative",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  border: "2px dashed rgba(255,107,53,0.2)",
                }}
              />
              <span style={{ fontSize: "8rem" }}>🍽️</span>
            </motion.div>

            {["🍕", "🍜", "🌮", "🍣"].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.sin(i * 1.5) * 10, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                style={{
                  position: "absolute",
                  top: `${15 + (i * 22)}%`,
                  left: i % 2 === 0 ? "-10%" : "85%",
                  fontSize: "2.5rem",
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;