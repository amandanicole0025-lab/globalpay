// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDX0uBtAKANcNEHdy4r-aqn_XWZYq1Fuw",
  authDomain: "globalpay-58614.firebaseapp.com",
  projectId: "globalpay-58614",
  storageBucket: "globalpay-58614.firebasestorage.app",
  messagingSenderId: "1091762703213",
  appId: "1:1091762703213:web:0ee29229b7171c5cf8e864"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);