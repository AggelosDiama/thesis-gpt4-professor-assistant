import { auth } from "./config/firebaseConfig.js";
import { signOut, onAuthStateChanged } from "@firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// Function to toggle the dropdown menu
window.toggleDropdown = function () {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("show");
};

// Function to toggle visibility of the new exercise button based on user role
function toggleNewExerciseButtonVisibility(user) {
  const newExerciseButton = document.querySelector(".new-exr-btn");
  if (user && user.isProfessor === true) {
    newExerciseButton.style.display = "block";
  } else {
    newExerciseButton.style.display = "none";
  }
}

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
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDocRef = doc(getFirestore(), "users", user.uid); // Access Firestore instance
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      // Toggle visibility of new exercise button based on user role
      toggleNewExerciseButtonVisibility(userData);
    } catch (error) {
      console.error("Error:", error);
    }

    const userLink = document.getElementById("usernameLink");
    const username = user.displayName || "User"; // Use default if display name is not set
    userLink.textContent = username;
    userLink.href = "#";
  } else {
    console.log("User is signed out");
  }
});
