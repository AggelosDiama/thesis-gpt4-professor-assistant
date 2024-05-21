import { app, auth } from "./config/firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { getFirestore, doc, setDoc } from "@firebase/firestore";

const db = getFirestore(app);

// Event listener for registration form submission
const registerForm = document.querySelector(".register");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirm_password.value;
  const username = registerForm.username.value;
  const isProfessor = false; // Default value

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    alert("Password and confirm password do not match");
    return; // Exit registration if passwords don't match
  }

  try {
    // Register a user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Update user profile after registration with the username value and photo
    await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: "public/images/profile.png",
    });

    // Create a document for the user with the isProfessor attribute
    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      isProfessor: isProfessor,
    });

    console.log("User created:", user);
    window.location.href = "./join-exe.html"; // user by default is a student

    registerForm.reset();
  } catch (err) {
    console.log("Error creating user:", err.message);
  }
});
