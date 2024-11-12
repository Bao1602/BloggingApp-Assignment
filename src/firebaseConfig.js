// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQS7BkmD7_66XUEnXDqKWyOyv_arLi-Xc",
  authDomain: "favoritefeature.firebaseapp.com",
  projectId: "favoritefeature",
  storageBucket: "favoritefeature.firebasestorage.app",
  messagingSenderId: "199939269976",
  appId: "1:199939269976:web:ea79ff4108916b9df8b12d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
