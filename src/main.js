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
} from "firebase/firestore";

// Function to toggle the dropdown menu
window.toggleDropdown = function () {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("show");
};

// Global variable to store the ID of the active exercise document
let ActiveExerciseDocId;

// Function to create a new exercise document in Firestore
async function createNewExercise(title, date, visibility) {
  const docRef = collection(getFirestore(), "exercises"); // Get a reference to the collection
  const newExerciseDoc = await addDoc(docRef, { title, date, visibility }); // Add document and get the reference

  // Store the ID of the active exercise document
  ActiveExerciseDocId = newExerciseDoc.id;
  // Store the ID of the active exercise document in localStorage
  localStorage.setItem("ActiveExerciseDocId", ActiveExerciseDocId);

  // Initialize the messages subcollection for this exercise
  const messagesRef = collection(newExerciseDoc, "messages");
  await addDoc(messagesRef, {
    text: "Exercise created",
    timestamp: serverTimestamp(),
  });

  // Update the UI with the new exercise
  const exerciseList = document.querySelector(".exercise-list ul");
  const ExerciseItem = document.createElement("li");
  ExerciseItem.textContent = `${title} - ${date}`;
  ExerciseItem.setAttribute("doc-id", ActiveExerciseDocId); // Add the ID attribute
  ExerciseItem.addEventListener("click", selectExercise); // Add event listener
  exerciseList.appendChild(ExerciseItem);
}

// Event listener function to select an exercise
function selectExercise(event) {
  // Get the ID of the selected exercise
  const exerciseId = event.currentTarget.getAttribute("doc-id");

  // Update the ActiveExerciseDocId
  ActiveExerciseDocId = exerciseId;

  // Update the localStorage
  localStorage.setItem("ActiveExerciseDocId", ActiveExerciseDocId);
  console.log(localStorage.getItem("ActiveExerciseDocId"));
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

      // Check if the user is a professor
      if (userData.isProfessor) {
        // Create the new exercise button based on user role
        const newExerciseButton = createNewExerciseButton(userData);
        const userSettings = document.querySelector(".user-settings");
        userSettings.parentNode.insertBefore(newExerciseButton, userSettings);

        // Update the chat history with exercises from Firestore
        const exerciseList = document.querySelector(".exercise-list ul");
        exerciseList.textContent = " ";
        const exercisesRef = collection(getFirestore(), "exercises");
        const querySnapshot = await getDocs(exercisesRef);
        querySnapshot.forEach((doc) => {
          const exercise = doc.data();
          //console.log(exercise);

          const ExerciseItem = document.createElement("li");
          ExerciseItem.textContent = `${exercise.title} - ${exercise.date}`;

          ExerciseItem.setAttribute("doc-id", doc.id);
          ExerciseItem.addEventListener("click", selectExercise); // Add event listener

          exerciseList.appendChild(ExerciseItem);
        });

        // Set the title for the chat history
        document.querySelector(".exercise-list p b").textContent =
          "Exercises History";
      } else {
        // Set the title for the exercise instructions
        document.querySelector(".exercise-list p b").textContent =
          "Exercise Instructions";

        // Create a paragraph with instructions
        const instructionsParagraph = document.createElement("p");
        instructionsParagraph.innerHTML =
          "<b> --- READ HERE FIRST --- </b>These are the instructions for the lab exercise. Please copy paste in the chat prompt your code solution and press send. You will recieve a response with detailed feedback for your solution and with a respective grade (out of 10) which is not final.    <b>DISCLAIMER</b>: At this version the file upload feature is not available!";
        instructionsParagraph.classList.add("instruction-paragraph"); // Add class to the paragraph

        // Append the paragraph to the exercise list
        const exerciseList = document.querySelector(".exercise-list ul");
        exerciseList.textContent = " ";
        exerciseList.appendChild(instructionsParagraph);
      }
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

    // Reset the form
    event.target.reset();
  });
