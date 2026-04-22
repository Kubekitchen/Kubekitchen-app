import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, LogOut, User, ChefHat, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 24px",
        background: scrolled ? "rgba(15,15,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{
              background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
              borderRadius: 12,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChefHat size={22} color="white" />
          </motion.div>
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            KubeKitchen
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <Link to="/restaurants" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: location.pathname === "/restaurants" ? "rgba(255,107,53,0.15)" : "transparent",
                    border: "none",
                    color: location.pathname === "/restaurants" ? "#ff6b35" : "#a0a0b8",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Restaurants
                </motion.button>
              </Link>
              <Link to="/orders" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: location.pathname === "/orders" ? "rgba(255,107,53,0.15)" : "transparent",
                    border: "none",
                    color: location.pathname === "/orders" ? "#ff6b35" : "#a0a0b8",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  My Orders
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                style={{
                  position: "relative",
                  background: "rgba(255,107,53,0.1)",
                  border: "1px solid rgba(255,107,53,0.3)",
                  borderRadius: 12,
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#ff6b35",
                }}
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <User size={14} color="#a0a0b8" />
                  <span style={{ fontSize: "0.85rem", color: "#a0a0b8", fontWeight: 500 }}>
                    {user.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    cursor: "pointer",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary" style={{ padding: "8px 20px" }}>Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: "8px 20px" }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;