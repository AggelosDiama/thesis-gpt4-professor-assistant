import { app, auth } from "./config/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "@firebase/auth";
import { getFirestore, collection, doc, setDoc } from "@firebase/firestore";

const db = getFirestore(app);

// Event listener for registration form submission
const registerForm = document.querySelector(".register");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirm_password.value;
  const username = registerForm.username.value;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    console.log("Password and confirm password do not match");
    return; // Exit registration if passwords don't match
  }

  // Register a user
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (cred) => {
      const user = cred.user;

      // Update user profile after registration with the username value and photo
      updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: "public/images/profile.png",
      });
      // Create a document for the user with the professor attribute set to false
      //   await db.collection("users").doc("user-id").set.set({
      //   professor: false,
      // });
      console.log("User created:", user);
    })
    .then(() => {
      // Reset the registration form after successful user creation and document update
      registerForm.reset();
    })
    .catch((err) => {
      console.log("Error creating user:", err.message);
    });
});
