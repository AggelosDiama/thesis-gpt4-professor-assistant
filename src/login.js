import { auth } from "./config/firebaseConfig.js";
import { signInWithEmailAndPassword } from "@firebase/auth";

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in:", cred.user);

      // Redirect to main.html upon successful login
      window.location.href = "./main.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
});
