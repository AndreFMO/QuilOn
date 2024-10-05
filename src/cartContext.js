import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product, quantity) => {
    if (quantity <= 0) return; // Validação de quantidade
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.product[0] === product[0]);
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  }, []);

  const incrementQuantity = useCallback((index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += 1;
      return updatedCart;
    });
  }, []);

  const decrementQuantity = useCallback((index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      }
      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((acc, item) => acc + item.product[5] * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
