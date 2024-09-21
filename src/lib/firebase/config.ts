import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBLIu54l_MFzG4G7QO34tUl6LhHUzfsEx4",
  authDomain: "ars-antiqua.firebaseapp.com",
  projectId: "ars-antiqua",
  storageBucket: "ars-antiqua.appspot.com",
  messagingSenderId: "42107927354",
  appId: "1:42107927354:web:4ce8583ae1a6cb8539ae03",
  measurementId: "G-9L07RXZCZD"
};

export const app = initializeApp(firebaseConfig);