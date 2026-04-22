import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ChefHat, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🍽️");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          background: "radial-gradient(ellipse at 30% 50%, rgba(255,107,53,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(108,99,255,0.1) 0%, transparent 60%)",
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
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "0.9rem" }}>
            Sign in to KubeKitchen
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              placeholder="Password"
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;