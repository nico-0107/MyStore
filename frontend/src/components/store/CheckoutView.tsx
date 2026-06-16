// src/components/store/CheckoutView.tsx
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface Props {
  onBack: () => void;
}

export const CheckoutView = ({ onBack }: Props) => {
  const { cart, totalPrice, clearCart } = useCart();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón de carga
  
  // Estado para guardar todos los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    reference: '',
    paymentMethod: 'yape', // 'efectivo' o 'yape'
    exactCash: true,
    cashAmount: ''
  });

  // Función para capturar los textos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Función mágica para obtener el GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta la geolocalización.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Generamos un link directo a Google Maps con las coordenadas
        const mapsLink = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
        // Lo agregamos automáticamente al campo de referencias
        setFormData(prev => ({ 
          ...prev, 
          address: prev.address 
            ? `${prev.address} - GPS: ${mapsLink}` 
            : `GPS: ${mapsLink}` 
        }));
        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("No se pudo obtener la ubicación. Por favor, asegúrate de darle permisos a la página.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, 
        maximumAge: 0
      }
    );
  };

  // Función provisional para enviar (la conectaremos a WhatsApp después)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const listaProductos = cart.map(item => {
      const cargoEnvase = (item.isReturnable && !item.hasBottle) ? (item.returnableType === 'gaseosa' ? 2 : 1) : 0;
      const subtotalItem = (item.price + cargoEnvase) * item.quantity;

      let notaEnvase = '';
      if (item.isReturnable) {
        notaEnvase = item.hasBottle ? ' 🔄 (Deja envase)' : ` ⚠️ (No tiene envase: +S/ ${cargoEnvase * item.quantity})`;
      }
      return `▪ ${item.quantity}x ${item.name}${notaEnvase} (S/ ${subtotalItem.toFixed(2)})`;
    }).join('\n');

    let detallePago = formData.paymentMethod === 'yape' ? '📱 Yape' : '💵 Efectivo';
      
    if (formData.paymentMethod === 'efectivo') {
      if (formData.exactCash) {
        detallePago += ' (Monto exacto)';
      } else {
        const montoIngresado = parseFloat(formData.cashAmount) || 0;
        const vuelto = montoIngresado - totalPrice;
        detallePago += ` (Paga con S/ ${montoIngresado.toFixed(2)} | 🟢 *Vuelto a llevar: S/ ${vuelto.toFixed(2)}*)`;
      }
    }

    // 3. Construimos el mensaje final con emojis
    const mensajeTexto = `
🚨 *¡NUEVO PEDIDO DE LA TIENDITA!* 🚨

👤 *Cliente:* ${formData.name}
📞 *Celular:* ${formData.phone}
📍 *Dirección:* ${formData.address}
🏠 *Referencias:* ${formData.reference || 'Ninguna'}

🛒 *LISTA DE COMPRAS:*
${listaProductos}

💰 *TOTAL A PAGAR:* S/ ${totalPrice.toFixed(2)}
💳 *PAGO:* ${detallePago}
`.trim();

    try {
      // Hacemos la petición a nuestro futuro servidor Node.js local
      const response = await fetch('http://localhost:3001/api/orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: mensajeTexto })
      });

      if (response.ok) {
        alert("¡Pedido enviado a la tienda exitosamente!");
        clearCart(); // Vaciamos la bolsa
        onBack();    // Regresamos al catálogo
      } else {
        alert("Hubo un error al enviar el pedido. Intenta de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Asegúrate de que el servidor esté encendido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-5 pb-24 max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-3xl font-serif text-[#2c4c3b]">Tus Datos</h2>
        <button onClick={onBack} className="text-sm text-[#426b27] font-medium flex items-center gap-1">
          <span>‹</span> Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#426b27]" />
        </div>

        {/* Celular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Celular</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 987654321" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#426b27]" />
        </div>

        {/* Dirección y Ubicación */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <button type="button" onClick={handleGetLocation} className="text-xs text-[#426b27] font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md active:bg-green-100">
              {loadingLocation ? '📍 Buscando...' : '📍 Enviar mi ubicación'}
            </button>
          </div>
          <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Mz A Lote 5, Calle Las Flores" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#426b27]" />
        </div>

        {/* Referencias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referencias (Color de casa, pisos)</label>
          <textarea name="reference" value={formData.reference} onChange={handleChange} placeholder="Casa verde de 2 pisos, portón negro..." rows={2} className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#426b27] resize-none" />
        </div>

        {/* Método de Pago */}
        <div className="mt-2 border-t border-gray-100 pt-4">
          <label className="block text-sm font-bold text-gray-800 mb-3">¿Cómo vas a pagar? (Total: S/ {totalPrice.toFixed(2)})</label>
          <div className="flex gap-4">
            <label className={`flex-1 border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer transition-colors ${formData.paymentMethod === 'yape' ? 'border-[#426b27] bg-green-50' : 'border-gray-200 bg-white'}`}>
              <input type="radio" name="paymentMethod" value="yape" checked={formData.paymentMethod === 'yape'} onChange={handleChange} className="hidden" />
              <span className="text-lg">📱</span>
              <span className="font-medium text-sm text-gray-800">Yape</span>
            </label>
            <label className={`flex-1 border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer transition-colors ${formData.paymentMethod === 'efectivo' ? 'border-[#426b27] bg-green-50' : 'border-gray-200 bg-white'}`}>
              <input type="radio" name="paymentMethod" value="efectivo" checked={formData.paymentMethod === 'efectivo'} onChange={handleChange} className="hidden" />
              <span className="text-lg">💵</span>
              <span className="font-medium text-sm text-gray-800">Efectivo</span>
            </label>
          </div>
        </div>

        {/* Condicional para Efectivo */}
        {formData.paymentMethod === 'efectivo' && (
          <div className="bg-gray-50 p-4 rounded-xl mt-1 border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" name="exactCash" checked={formData.exactCash} onChange={handleChange} className="w-4 h-4 text-[#426b27] accent-[#426b27]" />
              <span className="text-sm font-medium text-gray-700">Tengo el monto exacto</span>
            </label>
            
            {!formData.exactCash && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">¿Con cuánto vas a pagar?</label>
                <input type="number" name="cashAmount" value={formData.cashAmount} onChange={handleChange} placeholder={`Ej. 20 (Para dar vuelto)`} className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#426b27]" />
              </div>
            )}
          </div>
        )}

        <button type="submit" className="w-full bg-[#426b27] text-white py-3.5 rounded-xl font-bold text-lg active:bg-[#2d4a1a] transition-colors shadow-lg mt-4">
          Generar Orden
        </button>
      </form>
    </div>
  );
};