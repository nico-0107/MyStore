// src/components/store/CartView.tsx
import { useCart } from '../../context/CartContext';

interface Props {
  onBack: () => void; // Función para regresar al catálogo
  onCheckout: () => void;
}

export const CartView = ({ onBack, onCheckout }: Props) => {
  const { cart, updateQuantity, totalPrice, clearCart } = useCart();

  // Si no hay productos, mostramos un mensaje vacío
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 px-5 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🛒</span>
        </div>
        <h2 className="text-xl font-serif text-gray-800 mb-2">Tu bolsa está vacía</h2>
        <p className="text-gray-500 mb-6 text-sm">Aún no has agregado ningún producto.</p>
        <button onClick={onBack} className="bg-[#426b27] text-white px-6 py-2 rounded-lg font-medium">
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-24 max-w-md mx-auto animate-fade-in">
      {/* Título y Botones superiores */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-3xl font-serif text-[#2c4c3b]">Mis Compras</h2>
        
        {/* NUEVO: Contenedor para los botones superiores */}
        <div className="flex items-center gap-4">
          <button 
            onClick={clearCart} 
            className="text-xs text-red-400 font-medium border border-red-200 px-2 py-1 rounded-md active:bg-red-50"
          >
            Vaciar todo
          </button>
          <button onClick={onBack} className="text-sm text-[#426b27] font-medium flex items-center gap-1">
            <span>‹</span> Volver
          </button>
        </div>
      </div>

      {/* Lista de productos en la bolsa */}
      <div className="flex flex-col gap-0 border-t border-gray-100">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 py-4">
            {/* Imagen */}
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            
            {/* Detalles y Selector */}
            <div className="flex-grow">
              <h3 className="font-serif text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
              <p className="text-[#5b8041] text-xs mb-2">S/ {item.price.toFixed(2)} c/u</p>
              
              <select
                className="bg-white border border-gray-200 text-gray-800 text-sm py-1 px-2 rounded-lg cursor-pointer outline-none shadow-sm"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              >
                {/* Agregamos el 0 como opción para eliminar */}
                <option value={0}>0 (Eliminar)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Subtotal por producto */}
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium">
                S/ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total a pagar */}
      <div className="flex justify-between items-center mt-6 mb-8">
        <p className="text-xl font-serif text-gray-800">Subtotal</p>
        <p className="text-xl text-[#426b27] font-bold">S/ {totalPrice.toFixed(2)}</p>
      </div>

      {/* Botón para ir a llenar datos */}
      <button 
        onClick={onCheckout}
        className="w-full bg-[#426b27] text-white py-3.5 rounded-xl font-bold text-lg active:bg-[#2d4a1a] transition-colors shadow-lg"
      >
        Continuar con el pedido
      </button>
    </div>
  );
};