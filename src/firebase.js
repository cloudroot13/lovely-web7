// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARFrQs2n18398u3EvNekXmbE-AjZ16lIY",
  authDomain: "cupidmagic-2ce12.firebaseapp.com",
  projectId: "cupidmagic-2ce12",
  storageBucket: "cupidmagic-2ce12.firebasestorage.app",
  messagingSenderId: "505742621430",
  appId: "1:505742621430:web:960db12310b555d5b54ad7",
  measurementId: "G-LENGH2T3BE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);