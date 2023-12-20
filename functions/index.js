
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAdrmtigXisK1_l5x6YQ5s2Fg3QARctuQo",
  authDomain: "thesis-77e2b.firebaseapp.com",
  databaseURL: "https://thesis-77e2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thesis-77e2b",
  storageBucket: "thesis-77e2b.appspot.com",
  messagingSenderId: "229809480316",
  appId: "1:229809480316:web:960c1d9639f9d2722e9ff9",
  measurementId: "G-WBKP5MW0W7"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)

      // Redirect to main.html upon successful login
      window.location.href = './main.html';
    })
    .catch(err => {
      console.log(err.message)
    })

})