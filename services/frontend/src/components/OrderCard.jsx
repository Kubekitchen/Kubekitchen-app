import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, CheckCircle, Package, Truck, XCircle, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: { color: "#eab308", bg: "rgba(234,179,8,0.1)", icon: <AlertCircle size={14} />, label: "Pending" },
  confirmed: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: <CheckCircle size={14} />, label: "Confirmed" },
  preparing: { color: "#f97316", bg: "rgba(249,115,22,0.1)", icon: <Package size={14} />, label: "Preparing" },
  out_for_delivery: { color: "#6c63ff", bg: "rgba(108,99,255,0.1)", icon: <Truck size={14} />, label: "Out for Delivery" },
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: <CheckCircle size={14} />, label: "Delivered" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: <XCircle size={14} />, label: "Cancelled" },
};

const OrderCard = ({ order, index = 0 }) => {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>{order.restaurantName}</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: status.bg,
            color: status.color,
            padding: "6px 12px",
            borderRadius: 50,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {status.icon} {status.label}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {item.quantity}× {item.name}
            </span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {order.deliveryAddress?.city && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <MapPin size={13} /> {order.deliveryAddress.city}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <Clock size={13} /> {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ff6b35" }}>
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
};

export default OrderCard;