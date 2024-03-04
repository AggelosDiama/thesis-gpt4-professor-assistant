import { auth } from "./config/firebaseConfig.js";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("user logged in:", userCred.user);

    const userDocRef = doc(getFirestore(), "users", userCred.user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();

    // Redirect to appropriate page based on the role
    if (userData.isProfessor) {
      // Professor is logging in
      window.location.href = "./main.html";
    } else {
      // Student is logging in
      window.location.href = "./join-exe.html";
    }
  } catch (err) {
    console.log(err.message);
  }
});
