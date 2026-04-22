import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "3px solid rgba(255,107,53,0.2)",
        borderTopColor: "#ff6b35",
      }}
    />
  </div>
);

export default LoadingSpinner;