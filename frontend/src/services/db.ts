// frontend/src/services/db.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'productos');
  const productSnapshot = await getDocs(productsCol);
  
  const productList = productSnapshot.docs.map(doc => {
    const data = doc.data();
    
    // Imprimimos en consola para ver exactamente qué está llegando
    console.log("Producto desde Firebase:", doc.id, data);
    
    return {
      id: doc.id,
      name: data.name || 'Producto sin nombre',
      price: Number(data.price) || 0, 
      category: data.category || 'Otros',
      imageUrl: data.imageUrl || 'https://via.placeholder.com/150',
      // NUEVO: Jalamos los datos de retornables de Firebase
      isReturnable: data.isReturnable || false,
      returnableType: data.returnableType || null
    } as Product;
  }); 

  return productList;
};