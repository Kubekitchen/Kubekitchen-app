import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, MapPin, Phone } from "lucide-react";
import { restaurantAPI, menuAPI } from "../api/axios";
import MenuCard from "../components/MenuCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = ["all", "starter", "main", "dessert", "beverage", "side"];

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, mRes] = await Promise.all([
          restaurantAPI.get(`/${id}`, false),
          menuAPI.get(`/restaurant/${id}`, false),
        ]);
        setRestaurant(rRes.data);
        setMenuItems(mRes.data);
      } catch {
        navigate("/restaurants");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return null;

  const filtered =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  // Fix: must use _id not id so CartContext comparison works
  const restaurantForCart = {
    _id: restaurant._id,
    name: restaurant.name,
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 70, background: "#0f0f1a" }}>
      <div
        style={{
          height: 280,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a0a2e, #0f0f1a)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,107,53,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="page-container"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/restaurants")}
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 50,
              padding: "8px 16px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {restaurant.cuisine?.map((c) => (
                <span
                  key={c}
                  style={{
                    background: "rgba(255,107,53,0.2)",
                    border: "1px solid rgba(255,107,53,0.4)",
                    color: "#ff6b35",
                    padding: "3px 10px",
                    borderRadius: 50,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.2rem",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              {restaurant.name}
            </h1>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.9rem", color: "#ffd700" }}>
                <Star size={14} fill="#ffd700" />
                {restaurant.rating || "New"}{" "}
                {restaurant.totalRatings > 0 && `(${restaurant.totalRatings})`}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                <Clock size={14} /> {restaurant.deliveryTime}
              </span>
              {restaurant.address?.city && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <MapPin size={14} /> {restaurant.address.city}
                </span>
              )}
              {restaurant.phone && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <Phone size={14} /> {restaurant.phone}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: 50,
                border: activeCategory === cat ? "none" : "1px solid var(--border)",
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg, #ff6b35, #ff1f8e)"
                    : "transparent",
                color: activeCategory === cat ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: activeCategory === cat ? 700 : 500,
                textTransform: "capitalize",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🍽️</span>
            <p>No items in this category</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((item, i) => (
              <MenuCard key={item._id} item={item} restaurant={restaurantForCart} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;