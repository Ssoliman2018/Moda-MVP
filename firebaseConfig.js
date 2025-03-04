// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRkzy3BcMglmD1z7UXXK8XabkPAldqXjI",
  authDomain: "unlock-lm0eva.firebaseapp.com",
  projectId: "unlock-lm0eva",
  storageBucket: "unlock-lm0eva.appspot.com",
  messagingSenderId: "579190208909",
  appId: "1:579190208909:web:37ecfe4d6495b39c5f65c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
