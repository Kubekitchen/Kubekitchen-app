import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { restaurantAPI } from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CUISINES = ["All", "Italian", "Japanese", "Mexican", "Chinese", "Indian", "American", "Thai"];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCuisine !== "All") params.cuisine = selectedCuisine;
      const { data } = await restaurantAPI.get("", params);
      setRestaurants(data.data);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCuisine]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, background: "#0f0f1a" }}>
      <div className="page-container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Discover{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Restaurants
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Find the best food near you</p>
        </motion.div>

        <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: 46,
                borderRadius: 50,
                padding: "14px 20px 14px 46px",
                fontSize: "1rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            {CUISINES.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCuisine(c)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 50,
                  border: selectedCuisine === c ? "none" : "1px solid var(--border)",
                  background:
                    selectedCuisine === c
                      ? "linear-gradient(135deg, #ff6b35, #ff1f8e)"
                      : "transparent",
                  color: selectedCuisine === c ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: selectedCuisine === c ? 600 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}
          >
            <span style={{ fontSize: "4rem", display: "block", marginBottom: 16 }}>🍽️</span>
            <p style={{ fontSize: "1.1rem" }}>No restaurants found</p>
            <p style={{ fontSize: "0.9rem", marginTop: 8 }}>Try a different search or cuisine filter</p>
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {restaurants.map((r, i) => (
              <RestaurantCard key={r._id} restaurant={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;