// firebase-init.js  (USAR VIA CDN)

// 1) Config do SEU projeto (copiada do console)
const firebaseConfig = {
  apiKey: "AIzaSyBS3TR3k1no8fE3d-VCRpjkF6Q0w6s79Go",
  authDomain: "producao-lirio-branco.firebaseapp.com",
  projectId: "producao-lirio-branco",
  storageBucket: "producao-lirio-branco.firebasestorage.app",
  messagingSenderId: "26035930213",
  appId: "1:26035930213:web:0a5226f92ecffe7e27872c",
  measurementId: "G-Z3B11DN08X" // opcional
};

// 2) Imports via CDN (Firebase v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 3) Inicializa e exporta para outros arquivos
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
