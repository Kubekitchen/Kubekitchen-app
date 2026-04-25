import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Flame, Leaf } from "lucide-react";
import { useCart } from "../context/CartContext";

const CATEGORY_IMAGES = {
  starter: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=300&h=200&fit=crop",
  main: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
  dessert: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=200&fit=crop",
  beverage: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
  side: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=300&h=200&fit=crop",
};

const SPICE_COLORS = {
  mild: "#22c55e",
  medium: "#eab308",
  hot: "#f97316",
  "extra-hot": "#ef4444",
};

const MenuCard = ({ item, restaurant, index = 0 }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const cartItem = cartItems.find((i) => i._id === item._id);
  const quantity = cartItem?.quantity || 0;
  const image = item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: "var(--bg-card)",
        border: quantity > 0 ? "1px solid rgba(255,107,53,0.4)" : "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ position: "relative", height: 160 }}>
        <img
          src={image}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
          {item.isVeg && (
            <span
              style={{
                background: "rgba(34,197,94,0.9)",
                color: "white",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf size={12} />
            </span>
          )}
          {item.spiceLevel !== "mild" && (
            <span
              style={{
                background: `${SPICE_COLORS[item.spiceLevel]}cc`,
                color: "white",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={12} />
            </span>
          )}
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 8 }}>
          <span
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#ffd700",
              padding: "3px 10px",
              borderRadius: 50,
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ padding: "12px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 4 }}>{item.name}</h4>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            {item.description}
          </p>
          {item.calories && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.calories} cal</span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(item, restaurant)}
              style={{
                background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                border: "none",
                borderRadius: 50,
                padding: "6px 20px",
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Plus size={14} /> Add
            </motion.button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.4)",
                borderRadius: 50,
                padding: "4px 8px",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromCart(item._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff6b35",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Minus size={14} />
              </motion.button>
              <span style={{ fontWeight: 700, color: "#ff6b35", minWidth: 16, textAlign: "center" }}>
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => addToCart(item, restaurant)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff6b35",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Plus size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;