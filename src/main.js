//import { initializeApp } from 'firebase/app';
import { auth } from "./config/firebaseConfig.js";
import { getAuth, signOut, onAuthStateChanged } from "@firebase/auth";
//import { getFirestore, doc, getDoc } from "firebase/firestore";

// Function to toggle the dropdown menu
window.toggleDropdown = function () {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("show");
};

//logging out
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
      // Redirect to index.html after logout
      window.location.href = "index.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Check if a user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userLink = document.getElementById("usernameLink");
    const username = user.displayName || "User"; // Use default if display name is not set
    userLink.textContent = username;
    userLink.href = "#"; // Set a dummy href, you can update it based on your requirements
  } else {
    console.log("User is signed out");
  }
});
