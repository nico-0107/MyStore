// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isReturnable?: boolean; 
  returnableType?: 'gaseosa' | 'cerveza';
}

export interface CartItem extends Product {
  quantity: number;
  hasBottle?: boolean;
}