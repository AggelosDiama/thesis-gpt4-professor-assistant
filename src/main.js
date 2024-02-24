import { auth } from "./config/firebaseConfig.js";
import { signOut, onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  addDoc,
  Timestamp,
} from "firebase/firestore"; // Import Firestore functions

// Function to toggle the dropdown menu
window.toggleDropdown = function () {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("show");
};

// Function to create a new exercise document in Firestore
async function createNewExercise(title, date, visibility) {
  const docRef = doc(getFirestore(), "exercises", title); // Get a reference to the document
  await setDoc(docRef, { title: title, date: date, visibility: visibility }); // Set the data

  // Update the UI with the new exercise
  const chatHistory = document.querySelector(".chat-history ul");
  const newExerciseItem = document.createElement("li");
  newExerciseItem.textContent = `${title} - ${date}`;
  chatHistory.appendChild(newExerciseItem);

  // Initialize the messages subcollection for this exercise
  const messagesRef = collection(docRef, "messages");
  await addDoc(messagesRef, {
    text: "Exercise created",
    timestamp: serverTimestamp(),
  });
}

// Function to create the new exercise button based on user role
function createNewExerciseButton(user) {
  const newExerciseButton = document.createElement("button");
  newExerciseButton.className = "new-exr-btn secondary-btn";
  newExerciseButton.addEventListener("click", () => {
    // Open the modal when the button is clicked
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
  });

  const newExerciseIcon = document.createElement("img");
  newExerciseIcon.src = "./images/plus-solid (1).svg";
  newExerciseButton.appendChild(newExerciseIcon);

  const newExerciseText = document.createTextNode("New Exercise");
  newExerciseButton.appendChild(newExerciseText);

  return newExerciseButton;
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

      // Create the new exercise button based on user role
      const newExerciseButton = createNewExerciseButton(userData);
      const userSettings = document.querySelector(".user-settings");
      userSettings.parentNode.insertBefore(newExerciseButton, userSettings);

      // Update the chat history with exercises from Firestore
      const exercisesRef = collection(getFirestore(), "exercises");
      const querySnapshot = await getDocs(exercisesRef);
      querySnapshot.forEach((doc) => {
        const exercise = doc.data();
        const chatHistory = document.querySelector(".chat-history ul");
        const newExerciseItem = document.createElement("li");
        newExerciseItem.textContent = `${exercise.title} - ${exercise.date}`;
        chatHistory.appendChild(newExerciseItem);
      });
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

var modal = document.getElementById("myModal"); // Get the modal
var newExerciseButton = document.querySelector(".new-exr-btn"); // Get the button that opens the modal
// var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

// When the user clicks the button, open the modal
// newExerciseButton.onclick = function () {
//   modal.style.display = "block";
// };

// When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   modal.style.display = "none";
// };

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };

// When the user clicks on the "Cancel" button, close the modal
var cancelButton = document.querySelector(".cancel-btn");
cancelButton.onclick = function () {
  modal.style.display = "none";
};

// When the user submits the form, save the data to Firestore
document
  .getElementById("exercise-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the form data
    var title = document.getElementById("exercise-title").value;
    var date = document.getElementById("exercise-date").value;
    var visibility = document.getElementById("visibility").checked;

    // Save the data to Firestore
    createNewExercise(title, date, visibility);

    // Close the modal
    modal.style.display = "none";
  });
