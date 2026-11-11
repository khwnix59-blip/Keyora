import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useStore } from './StoreContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number, personalization?: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CART_STORAGE_KEY = 'keyora_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, addToast } = useStore();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  const addToCart = (product: Product, qty = 1, personalization = '') => {
    if (product.stock <= 0) {
      addToast('error', 'Out of Stock', 'This item is currently sold out.');
      return;
    }

    const cleanPersonalization = personalization.trim();
    // Unique key per product + personalization combination
    const cartItemId = `${product.id}_${cleanPersonalization.toLowerCase()}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex >= 0) {
        const next = [...prev];
        const newQty = Math.min(product.stock, next[existingIndex].qty + qty);
        next[existingIndex] = {
          ...next[existingIndex],
          qty: newQty,
          product // update fresh product data
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          product,
          qty: Math.min(product.stock, qty),
          personalization: cleanPersonalization || undefined
        };
        return [...prev, newItem];
      }
    });

    addToast('success', 'Added to Cart', `${product.name} (${qty}) added.`);
    setIsCartOpen(true);
  };

  const updateQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const maxAllowed = item.product.stock;
          return { ...item, qty: Math.min(maxAllowed, qty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast('info', 'Item Removed', 'The item was removed from your bag.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  // Free delivery threshold if subtotal >= freeDeliveryThreshold (default 5000)
  const isFreeDelivery = settings.freeDeliveryThreshold
    ? subtotal >= settings.freeDeliveryThreshold
    : false;

  const deliveryCharges = subtotal === 0 ? 0 : isFreeDelivery ? 0 : (settings.deliveryCharges || 250);
  const total = subtotal + deliveryCharges;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryCharges,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
