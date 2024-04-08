import { auth } from "./config/firebaseConfig.js";
import { onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

// Global variable to store the ID of the active exercise document
let ActiveExerciseDocId;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Update the chat history with exercises from Firestore
      const exercisesRef = collection(getFirestore(), "exercises");
      const querySnapshot = await getDocs(exercisesRef);
      querySnapshot.forEach((doc) => {
        const exercise = doc.data();
        //console.log(doc.id);
        const chatHistory = document.querySelector(".exercise-list");

        // Create a div element to wrap the li and button
        const exerciseElement = document.createElement("div");
        exerciseElement.className = "exercise-item";

        // Store the ID of the active exercise document
        ActiveExerciseDocId = doc.id;

        // Create the li element with the exercise title and date
        const ExerciseItem = document.createElement("li");
        ExerciseItem.textContent = `${exercise.title}`;

        // Create the button element
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.className = "main-btn join-btn";
        joinButton.setAttribute("doc-id", ActiveExerciseDocId); // Add the ID attribute
        joinButton.addEventListener("click", selectExercise);

        // Append the li and button to the div element
        exerciseElement.appendChild(ExerciseItem);
        exerciseElement.appendChild(joinButton);

        // Append the div element to the chat history
        chatHistory.appendChild(exerciseElement);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log("User is signed out");
  }
});

// Increment studentsJoinedCount when a student joins an exercise
async function joinExercise(exerciseId) {
  try {
    const exerciseDocRef = doc(getFirestore(), "exercises", exerciseId);
    await updateDoc(exerciseDocRef, {
      "reportInfo.studentsJoinedCount": increment(1),
    });
    console.log("studentsJoinedCount incremented successfully");
  } catch (error) {
    console.error("Error incrementing studentsJoinedCount:", error);
  }
}

// Event listener function to select an exercise
async function selectExercise(event) {
  try {
    // Get the ID of the selected exercise
    const exerciseId = event.currentTarget.getAttribute("doc-id");

    // Increment studentsJoinedCount
    await joinExercise(exerciseId);

    // Update the ActiveExerciseDocId
    ActiveExerciseDocId = exerciseId;

    // Update the localStorage
    localStorage.setItem("ActiveExerciseDocId", ActiveExerciseDocId);

    // Redirect to the main.html page
    window.location.href = "main.html";
  } catch (error) {
    console.error("Error selecting exercise:", error);
    // Handle error if necessary
  }
}
