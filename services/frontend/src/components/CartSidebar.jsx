import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/axios";
import toast from "react-hot-toast";

const CartSidebar = () => {
  const { isOpen, setIsOpen, cartItems, restaurantInfo, totalAmount, clearCart, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipCode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city) {
      toast.error("Please fill in your delivery address");
      return;
    }
    setPlacing(true);
    try {
      await orderApi.post("", {
        items: cartItems,
        restaurantId: restaurantInfo.id,
        restaurantName: restaurantInfo.name,
        deliveryAddress: address,
        paymentMethod,
      });
      toast.success("🎉 Order placed successfully!");
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 1100,
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: 420,
              background: "#1a1a2e",
              zIndex: 1200,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingBag size={20} color="#ff6b35" />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your Cart</h2>
                {restaurantInfo && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    · {restaurantInfo.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: 8,
                  padding: 6,
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.menuItemId}
                        layout
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 12,
                          padding: "12px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</p>
                          <p style={{ color: "#ff6b35", fontSize: "0.85rem", fontWeight: 600 }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              border: "none",
                              borderRadius: 6,
                              width: 28,
                              height: 28,
                              cursor: "pointer",
                              color: "white",
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            −
                          </button>
                          <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart({ _id: item.menuItemId, ...item }, restaurantInfo)}
                            style={{
                              background: "rgba(255,107,53,0.2)",
                              border: "none",
                              borderRadius: 6,
                              width: 28,
                              height: 28,
                              cursor: "pointer",
                              color: "#ff6b35",
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <MapPin size={16} color="#ff6b35" />
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>Delivery Address</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input
                        placeholder="Street address"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          placeholder="City"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        />
                        <input
                          placeholder="ZIP Code"
                          value={address.zipCode}
                          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 10 }}>Payment</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["cash", "card", "upi"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: 8,
                            border: paymentMethod === m ? "1px solid #ff6b35" : "1px solid var(--border)",
                            background: paymentMethod === m ? "rgba(255,107,53,0.15)" : "transparent",
                            color: paymentMethod === m ? "#ff6b35" : "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>Total</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ff6b35" }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  style={{
                    width: "100%",
                    background: placing ? "rgba(255,107,53,0.5)" : "linear-gradient(135deg, #ff6b35, #ff1f8e)",
                    border: "none",
                    borderRadius: 12,
                    padding: 14,
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: placing ? "not-allowed" : "pointer",
                  }}
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </motion.button>
                <button
                  onClick={clearCart}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    marginTop: 8,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: 6,
                  }}
                >
                  <Trash2 size={13} /> Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;