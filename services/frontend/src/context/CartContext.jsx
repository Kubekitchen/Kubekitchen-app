import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  // NEW - cart open/close state lives here so navbar & sidebar both access it
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item, restaurant) => {
    if (cartRestaurant && cartRestaurant._id !== restaurant._id) {
      if (!window.confirm("Adding items from a new restaurant will clear your current cart. Continue?")) {
        return false;
      }
      setCartItems([]);
      setCartRestaurant(restaurant);
    }

    if (!cartRestaurant) setCartRestaurant(restaurant);

    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    return true;
  }, [cartRestaurant]);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const updated = prev.map(i =>
        i._id === itemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ).filter(i => i.quantity > 0);
      if (updated.length === 0) setCartRestaurant(null);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(i => i._id === itemId ? { ...i, quantity } : i)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartRestaurant(null);
    setIsOpen(false);
  }, []);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartRestaurant,
      restaurantInfo: cartRestaurant, // alias so CartSidebar works
      isOpen,
      setIsOpen,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;