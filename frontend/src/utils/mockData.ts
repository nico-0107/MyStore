// src/utils/mockData.ts
import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Inca Kola 1.5L',
    price: 7.50,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop', // Imagen referencial (Coca Cola en unsplash)
    category: 'Bebidas'
  },
  {
    id: '2',
    name: 'Galletas Casino Menta',
    price: 1.50,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop',
    category: 'Snacks'
  },
  {
    id: '3',
    name: 'Leche Gloria Tarro',
    price: 3.80,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400&auto=format&fit=crop',
    category: 'Abarrotes'
  },
  {
    id: '4',
    name: 'Arroz Costeño 1kg',
    price: 4.20,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
    category: 'Abarrotes'
  }
];