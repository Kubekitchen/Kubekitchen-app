import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { orderApi } from "../api/axios";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // FIX: use "/" not "" and proper params/auth signature
      const res = await orderApi.get("/", null, true);
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, background: "#0f0f1a" }}>
      <div className="page-container" style={{ paddingTop: 24, paddingBottom: 60, maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}
        >
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, marginBottom: 4 }}>
              My{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Orders
              </span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchOrders(true)}
            style={{
              background: "rgba(255,107,53,0.1)",
              border: "1px solid rgba(255,107,53,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              color: "#ff6b35",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <motion.span animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.5 }}>
              <RefreshCw size={16} />
            </motion.span>
            Refresh
          </motion.button>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
              background: "var(--bg-card)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            <ShoppingBag size={56} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>No orders yet</p>
            <p style={{ fontSize: "0.9rem" }}>Start ordering from your favorite restaurants!</p>
          </motion.div>
        ) : (
          <div>
            {orders.map((order, i) => (
              <OrderCard key={order._id} order={order} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;