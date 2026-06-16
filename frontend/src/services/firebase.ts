// src/services/firebase.ts
import { initializeApp } from "firebase/app";
// IMPORTANTE: Esta es la línea que faltaba para que reconozca getFirestore
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFiyq8IhHC0JqIezL2g2aSm577Wn61Dcg",
  authDomain: "mystoreapp-db0bc.firebaseapp.com",
  projectId: "mystoreapp-db0bc",
  storageBucket: "mystoreapp-db0bc.firebasestorage.app",
  messagingSenderId: "11776524838",
  appId: "1:11776524838:web:82469e30287e0f19f4dce7"
};

// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos la base de datos (Firestore)
export const db = getFirestore(app);