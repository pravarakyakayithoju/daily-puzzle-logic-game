// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHdWsyz66sFq9GAeMqaOcfsGEuJLQbNDU",
  authDomain: "daily-puzzle-logic-game-2be8b.firebaseapp.com",
  projectId: "daily-puzzle-logic-game-2be8b",
  storageBucket: "daily-puzzle-logic-game-2be8b.firebasestorage.app",
  messagingSenderId: "21891671995",
  appId: "1:21891671995:web:d9d588609b3044e1d5469e",
  measurementId: "G-9M220W63SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);