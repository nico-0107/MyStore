// src/context/CartContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función para agregar o sumar 1 si ya existe
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Función para cambiar la cantidad en el selector
  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity === 0) return prev.filter((item) => item.id !== productId);
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };
  const clearCart = () => {
    setCart([]);
  };

  // Calcular cuántos ítems hay en total para el logo de la bolsita
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};