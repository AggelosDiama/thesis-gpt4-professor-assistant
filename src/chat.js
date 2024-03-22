import { auth } from "./config/firebaseConfig.js";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore functions
import { ActiveExerciseDocId } from "./main.js";

// Forms
const chatForm = document.getElementById("chat-form");
const formInput = document.getElementById("chat-input");
const messagesContainer = document.querySelector(".messages");

//let ActiveExerciseDocId = localStorage.getItem("ActiveExerciseDocId");

// Initialize an empty array to store messages from Firestore
let messages = [];

// Check if the user is a professor
let endpoint = "studentChatRule"; // Default endpoint
const determineEndpoint = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDataSnapshot = await getDoc(
      doc(getFirestore(), "users", user.uid)
    );
    const userData = userDataSnapshot.data();
    if (userData && userData.isProfessor) {
      endpoint = "professorChatRule";
    }
  }
};

// Define the function to add a new message to Firestore
async function addMessageToFirestore(ActiveExerciseDocId, text, userId) {
  try {
    const exerciseDocRef = doc(
      getFirestore(),
      "exercises",
      ActiveExerciseDocId
    );
    const messagesRef = collection(exerciseDocRef, "messages");

    await addDoc(messagesRef, {
      message: text,
      timestamp: serverTimestamp(),
      userId: userId || null, // If userId is not provided, use null
    });

    console.log("Message added to Firestore successfully");
  } catch (error) {
    console.error("Error adding message to Firestore:", error);
  }
}

// Retrieve messages from Firestore
if (ActiveExerciseDocId) {
  const exerciseDocRef = doc(getFirestore(), "exercises", ActiveExerciseDocId);
  const messagesQuerySnapshot = await getDocs(
    collection(exerciseDocRef, "messages")
  );

  // Loop through the messages and extract the "message" field
  messagesQuerySnapshot.forEach((doc) => {
    messages.push(doc.data().message);
    //console.log(doc.data().message);
  });
  console.log(messages);
} else {
  console.error("Active exercise document ID not found");
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const user = auth.currentUser; // Get the current user
    await determineEndpoint(); // Call the function to determine the endpoint

    const userMessage = formInput.value;
    const newUserMessage = { role: "user", content: `${userMessage}` };
    messages.push(newUserMessage);

    // Store the message in Firestore
    if (ActiveExerciseDocId) {
      await addMessageToFirestore(
        ActiveExerciseDocId,
        newUserMessage,
        user?.uid
      );
    } else {
      console.error("Active exercise document ID not found");
    }

    formInput.value = "";

    // Create a new paragraph element for the user's input
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message"); // Add a class for styling
    userMessageElement.innerHTML = `
    <div class="message__text">${userMessage}</div>`;
    messagesContainer.appendChild(userMessageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const res = await fetch(
      `http://127.0.0.1:5001/thesis-77e2b/us-central1/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        mode: "cors",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const assistantMessage = await res.text();
    let newAssistantMessage = {
      role: "assistant",
      content: `${assistantMessage}`,
    };
    messages.push(newAssistantMessage);

    // Store the message in Firestore
    if (ActiveExerciseDocId) {
      await addMessageToFirestore(
        ActiveExerciseDocId,
        newAssistantMessage,
        user?.uid
      );
    } else {
      console.error("Active exercise document ID not found");
    }

    console.log(assistantMessage);

    // Create a new div element for the message
    const assistantMessageElement = document.createElement("div");
    assistantMessageElement.classList.add("user-message");
    assistantMessageElement.innerHTML = `
    <div class="message__text">${assistantMessage}</div>`;
    messagesContainer.appendChild(assistantMessageElement);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
