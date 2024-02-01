import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdrmtigXisK1_l5x6YQ5s2Fg3QARctuQo",
  authDomain: "thesis-77e2b.firebaseapp.com",
  databaseURL:
    "https://thesis-77e2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thesis-77e2b",
  storageBucket: "thesis-77e2b.appspot.com",
  messagingSenderId: "229809480316",
  appId: "1:229809480316:web:960c1d9639f9d2722e9ff9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//export default app;
