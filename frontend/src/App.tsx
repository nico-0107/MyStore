// src/App.tsx
import { useState } from 'react';
import { ProductGrid } from './components/store/ProductGrid';
import { mockProducts } from './utils/mockData';
import { CartProvider, useCart } from './context/CartContext';
import type { Product } from './types';
import { CartView } from './components/store/CartView';
import cartIcon from './assets/bolsa-compra.png';
import searchIcon from './assets/lupa.png';
import { CheckoutView } from './components/store/CheckoutView';

// Sub-componente principal para poder usar el useCart
const StoreFront = () => {
  const { totalItems, cart, updateQuantity } = useCart();
  const [lastAdded, setLastAdded] = useState<Product | null>(null);

  const [currentView, setCurrentView] = useState<'catalog' | 'cart' | 'checkout'>('catalog');

  const handleProductAdd = (product: Product) => {
    setLastAdded(product);
    // Ocultar la barra verde después de 3 segundos
    setTimeout(() => setLastAdded(null), 3000); 
  };

  // Buscar el producto en el carrito para saber su cantidad actual en la notificación
  const currentCartItem = lastAdded ? cart.find(item => item.id === lastAdded.id) : null;

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-800 relative">
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-[#fafaf8] z-10">
        <div className="w-6"></div>
        <h1 
          className="text-2xl font-serif text-[#2c4c3b] cursor-pointer"
          onClick={() => setCurrentView('catalog')}
        >
          MyStore
        </h1>
        
        <button className="relative" onClick={() => setCurrentView('cart')}>
          <img src={cartIcon} alt="Carrito" className="w-6 h-6 opacity-80" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#426b27] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* RENDERIZADO CONDICIONAL LIMPIO */}
      
      {currentView === 'catalog' && (
        <main className="px-5 pb-24 max-w-md mx-auto animate-fade-in">
          <div className="mb-4">
            <h2 className="text-2xl font-serif text-gray-400">
              Catálogo / <span className="text-[#2c4c3b]">Abarrotes</span>
            </h2>
          </div>

          <div className="relative mb-6">
            <img src={searchIcon} alt="Buscar" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#426b27] shadow-sm"
            />
          </div>

          <ProductGrid products={mockProducts} onAdd={handleProductAdd} />
        </main>
      )}

      {currentView === 'cart' && (
        <CartView 
          onBack={() => setCurrentView('catalog')} 
          onCheckout={() => setCurrentView('checkout')} 
        />
      )}

      {currentView === 'checkout' && (
        <CheckoutView onBack={() => setCurrentView('cart')} /> 
      )}

      {/* La Barra Verde solo debe salir si estamos en el catálogo */}
      <div 
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#426b27] text-white p-4 rounded-t-2xl shadow-2xl flex items-center gap-4 z-50 transition-transform duration-300 ${
          lastAdded && currentView === 'catalog' ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {lastAdded && currentCartItem && (
          <>
            <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1">
              <img src={lastAdded.imageUrl} alt={lastAdded.name} className="w-full h-full object-cover rounded" />
            </div>
            <div className="flex-grow">
              <p className="text-xs text-green-200 font-medium opacity-90">Agregando a la bolsa:</p>
              <p className="text-sm font-bold font-serif">{lastAdded.name}</p>
            </div>
            <select 
              className="bg-white text-gray-800 text-sm font-bold py-1 px-2 rounded cursor-pointer outline-none"
              value={currentCartItem.quantity}
              onChange={(e) => updateQuantity(lastAdded.id, parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <StoreFront />
    </CartProvider>
  );
}