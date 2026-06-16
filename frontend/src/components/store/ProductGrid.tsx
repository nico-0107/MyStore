// src/components/store/ProductGrid.tsx
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';

interface Props {
  products: Product[];
  onAdd: (product: Product) => void; // 1. Le decimos que va a recibir esta función
}

// 2. Extraemos onAdd de los parámetros
export const ProductGrid = ({ products, onAdd }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAdd={onAdd} // 3. Se la pasamos a la tarjeta individual
        />
      ))}
    </div>
  );
};