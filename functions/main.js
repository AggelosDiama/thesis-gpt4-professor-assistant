import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


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

// Function to toggle the dropdown menu
window.toggleDropdown = function() {
  const dropdown = document.querySelector('.dropdown-content');
  dropdown.classList.toggle('show');
}

//logging out
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out');
      // Redirect to index.html after logout
      window.location.href = 'index.html';
    })
    .catch(err => {
      console.log(err.message);
    });
});


// Check if a user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
      const userLink = document.getElementById('usernameLink');
      const username = user.displayName || 'User'; // Use default if display name is not set
      userLink.textContent = username;
      userLink.href = "#"; // Set a dummy href, you can update it based on your requirements
  } else {
      console.log('User is signed out');
  }
});
