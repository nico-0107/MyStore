// src/components/store/ProductCard.tsx
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface Props {
  product: Product;
  onAdd: (product: Product) => void; // Nueva prop para avisar a la App
}

export const ProductCard = ({ product, onAdd }: Props) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    onAdd(product); // Dispara la notificación visual
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-4">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="font-serif text-base text-gray-800 leading-tight">{product.name}</h3>
        <p className="text-[#5b8041] text-sm mb-2 font-medium">S/ {product.price.toFixed(2)}</p>
        
        <button 
          onClick={handleAdd}
          className="bg-[#426b27] text-white px-4 py-1.5 rounded-lg text-sm font-medium w-full active:bg-[#2d4a1a] transition-colors"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};