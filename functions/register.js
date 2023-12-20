import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
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

// Function to update user profile
const updateUserProfile = (user, displayName) => {
  updateProfile(user, { displayName })
    .then(() => {
      console.log("User profile updated successfully");
      console.log("Current user:", user);
    })
    .catch((err) => {
      console.log("Error updating user profile:", err.message);
    });
};

// Event listener for registration form submission
const registerForm = document.querySelector(".register");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirm_password.value; // Add this line to get the confirm password value
  const username = registerForm.username.value;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    console.log("Password and confirm password do not match");
    return; // Exit registration if passwords don't match
  }

  // Register a user
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const user = cred.user;
      console.log("User created:", user);

      // Update user profile after registration with the username value
      updateUserProfile(user, username);
      registerForm.reset()
    })
    .catch((err) => {
      console.log("Error creating user:", err.message);
    });
});