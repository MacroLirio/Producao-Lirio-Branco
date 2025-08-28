// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS3TR3k1no8fE3d-VCRpjkF6QOw6s79Go",
  authDomain: "producao-lirio-branco.firebaseapp.com",
  projectId: "producao-lirio-branco",
  storageBucket: "producao-lirio-branco.firebasestorage.app",
  messagingSenderId: "260359302213",
  appId: "1:260359302213:web:0a5226f92ecffe7e27872c",
  measurementId: "G-Z3B11DN0SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
