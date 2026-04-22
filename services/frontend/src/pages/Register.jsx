import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ChefHat, Eye, EyeOff, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Account created! Let's eat 🍕");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f1a, #1a0a2e, #0a1628)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(255,107,53,0.1) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(30,30,48,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 40,
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{
              display: "inline-flex",
              background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <ChefHat size={32} color="white" />
          </motion.div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "0.9rem" }}>
            Join KubeKitchen today
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <User
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Mail
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{ paddingLeft: 42, paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>I am a:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { val: "customer", label: "Customer", emoji: "🍽️" },
                { val: "restaurant_owner", label: "Restaurant Owner", emoji: "👨‍🍳" },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.val })}
                  style={{
                    padding: "10px",
                    border: form.role === r.val ? "2px solid #ff6b35" : "1px solid var(--border)",
                    borderRadius: 12,
                    background: form.role === r.val ? "rgba(255,107,53,0.1)" : "transparent",
                    color: form.role === r.val ? "#ff6b35" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;