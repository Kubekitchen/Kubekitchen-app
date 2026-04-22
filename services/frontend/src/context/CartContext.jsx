import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item, restaurant) => {
    if (restaurantInfo && restaurantInfo.id !== restaurant.id) {
      setCartItems([]);
    }
    setRestaurantInfo(restaurant);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (menuItemId) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
      if (updated.length === 0) setRestaurantInfo(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantInfo(null);
    setIsOpen(false);
  };

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantInfo,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};