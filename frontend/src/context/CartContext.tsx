import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleHasBottle: (productId: string) => void; // NUEVO: Para cambiar el estado de la botella
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Al agregar por primera vez, asumimos por defecto que SÍ tiene la botella (true)
      return [...prev, { ...product, quantity: 1, hasBottle: product.isReturnable ? true : undefined }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  // NUEVO: Función para alternar el checkbox de "Tengo botella"
  const toggleHasBottle = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, hasBottle: !item.hasBottle } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // NUEVO: Matemática recalculada incluyendo las penalidades por envase
  const totalPrice = cart.reduce((acc, item) => {
    let precioFinalProducto = item.price;
    
    // Si es retornable y NO tiene envase, sumamos la penalidad corresponditente
    if (item.isReturnable && item.hasBottle === false) {
      precioFinalProducto += item.returnableType === 'gaseosa' ? 2 : 1;
    }
    
    return acc + (precioFinalProducto * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, toggleHasBottle, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};