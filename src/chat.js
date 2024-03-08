import { app, db, auth } from "./config/firebaseConfig.js";
import {
  collection,
  getFirestore,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"; // Import Firestore functions

// Forms
const chatForm = document.getElementById("chat-form");
const formInput = document.getElementById("chat-input");

// Output elements
const messagesContainer = document.querySelector(".messages");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const userMessage = formInput.value;

    // Create a new paragraph element for the user's input
    const userMessageElement = document.createElement("p");
    userMessageElement.textContent = userMessage;
    userMessageElement.classList.add("user-message"); // Add a class for styling

    // Append the user's message to the messages container
    messagesContainer.appendChild(userMessageElement);

    // Fetch response message from server...
    const res = await fetch(
      "http://127.0.0.1:5001/thesis-77e2b/us-central1/studentChatRule",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formInput.value }),
        method: "POST",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const feedbackHtml = await res.text(); // Get the HTML-formatted feedback formatFeedback
    console.log(feedbackHtml);
    // Create a new div element for the message
    const newMessage = document.createElement("div");
    newMessage.innerHTML = feedbackHtml; // Set inner HTML with the formatted feedback

    // Append the new message to the messages container
    messagesContainer.appendChild(newMessage);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Retrieve the ID of the active exercise document from localStorage
    const ActiveExerciseDocId = localStorage.getItem("ActiveExerciseDocId");

    // Retrieve the user ID from Firebase Authentication
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    // Store the message in Firestore
    if (ActiveExerciseDocId) {
      const exerciseDocRef = doc(
        getFirestore(),
        "exercises",
        ActiveExerciseDocId
      ); // Get the exercise document reference
      const messagesRef = collection(exerciseDocRef, "messages"); // Get the messages subcollection reference

      await addDoc(messagesRef, {
        text: feedbackHtml, // Store the HTML-formatted feedback
        timestamp: serverTimestamp(),
        userId: userId,
      }); // Add the user message to the messages subcollection
    } else {
      console.error("Active exercise document ID not found");
    }

    chatForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
