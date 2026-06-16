// src/components/store/CartView.tsx
import { useCart } from '../../context/CartContext';

interface Props {
  onBack: () => void;
  onCheckout: () => void;
}

export const CartView = ({ onBack, onCheckout }: Props) => {
  const { cart, updateQuantity, totalPrice, clearCart, toggleHasBottle } = useCart();
  
  // ELIMINAMOS los cálculos de cargoEnvase de aquí arriba

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
      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-3xl font-serif text-[#2c4c3b]">Mis Compras</h2>
        
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

      <div className="flex flex-col gap-0 border-t border-gray-100">
        {/* CORRECCIÓN: Agregamos las llaves { } para poder hacer cálculos antes del return */}
        {cart.map((item) => {
          // AHORA SÍ: Calculamos el subtotal aquí adentro donde "item" existe
          const cargoEnvase = (item.isReturnable && !item.hasBottle) ? (item.returnableType === 'gaseosa' ? 2 : 1) : 0;
          const subtotalItem = (item.price + cargoEnvase) * item.quantity;

          return (
            <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 py-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-serif text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
                <p className="text-[#5b8041] text-xs mb-1">S/ {item.price.toFixed(2)} c/u</p>
                
                <div className="flex flex-col gap-2">
                  <select
                    className="w-20 bg-white border border-gray-200 text-gray-800 text-xs py-1 px-1.5 rounded-lg cursor-pointer outline-none shadow-sm"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  >
                    <option value={0}>0 (Eliminar)</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>

                  {item.isReturnable && (
                    <label className="flex items-center gap-2 mt-1 bg-gray-50 p-2 rounded-lg cursor-pointer border border-gray-100 max-w-[200px]">
                      <input
                        type="checkbox"
                        checked={item.hasBottle}
                        onChange={() => toggleHasBottle(item.id)}
                        className="w-3.5 h-3.5 accent-[#426b27]"
                      />
                      <div className="text-[11px] text-gray-600 leading-tight">
                        <span>Tengo botella para cambio</span>
                        {!item.hasBottle && (
                          <span className="block text-red-500 font-bold font-sans mt-0.5">
                            (+S/ {item.returnableType === 'gaseosa' ? '2.00' : '1.00'} c/u)
                          </span>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-600 text-sm font-medium">
                  S/ {subtotalItem.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6 mb-8">
        <p className="text-xl font-serif text-gray-800">Subtotal</p>
        <p className="text-xl text-[#426b27] font-bold">S/ {totalPrice.toFixed(2)}</p>
      </div>

      <button 
        onClick={onCheckout}
        className="w-full bg-[#426b27] text-white py-3.5 rounded-xl font-bold text-lg active:bg-[#2d4a1a] transition-colors shadow-lg"
      >
        Continuar con el pedido
      </button>
    </div>
  );
};