import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Clock, MapPin, Truck } from "lucide-react";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=250&fit=crop",
];

const RestaurantCard = ({ restaurant, index = 0 }) => {
  const navigate = useNavigate();
  const image = restaurant.image || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
      }}
      className="card"
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={image}
          alt={restaurant.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <span
            style={{
              background: restaurant.isActive ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
              color: "white",
              padding: "4px 10px",
              borderRadius: 50,
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          >
            {restaurant.isActive ? "Open" : "Closed"}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {restaurant.cuisine?.slice(0, 2).map((c) => (
              <span
                key={c}
                style={{
                  background: "rgba(255,107,53,0.85)",
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: 50,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "var(--text-primary)" }}>
          {restaurant.name}
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            marginBottom: 12,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {restaurant.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={14} fill="#ffd700" color="#ffd700" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffd700" }}>
              {restaurant.rating || "New"}
            </span>
            {restaurant.totalRatings > 0 && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                ({restaurant.totalRatings})
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {restaurant.deliveryTime}
            </span>
          </div>
        </div>

        {restaurant.address?.city && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
            <MapPin size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {restaurant.address.city}
            </span>
          </div>
        )}

        {restaurant.minimumOrder > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
            <Truck size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Min. order: ${restaurant.minimumOrder}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantCard;