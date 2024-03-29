import { auth } from "./config/firebaseConfig.js";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore"; // Import Firestore functions

// Forms
const chatForm = document.getElementById("chat-form");
const formInput = document.getElementById("chat-input");
const messagesContainer = document.querySelector(".messages");

let ActiveExerciseDocId = localStorage.getItem("ActiveExerciseDocId");

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
    if (!userData || !userData.isProfessor) {
      // Retrieve messages that have isProfessor set to true
      const exerciseDocRef = doc(
        getFirestore(),
        "exercises",
        ActiveExerciseDocId
      );
      const messagesQuery = query(
        collection(exerciseDocRef, "messages"),
        where("isProfessor", "==", true)
      );

      const messagesQuerySnapshot = await getDocs(messagesQuery);

      messages = []; // Clear previous messages

      messagesQuerySnapshot.forEach((doc) => {
        messages.push(doc.data().message.content);
      });
    }
  }
};

// Define the function to add a new message to Firestore
async function addMessageToFirestore(
  ActiveExerciseDocId,
  text,
  userId,
  isProfessor
) {
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
      userId: userId || null,
      isProfessor: isProfessor || false, // Default to false if isProfessor is not provided
    });

    console.log("Message added to Firestore successfully");
  } catch (error) {
    console.error("Error adding message to Firestore:", error);
  }
}

// Function to create a new exercise with automatic name and update UI
async function createNewExercise() {
  try {
    const exercisesRef = collection(getFirestore(), "exercises");
    const querySnapshot = await getDocs(exercisesRef);

    const exerciseNumber = querySnapshot.size + 1; // Increment the exercise number
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date

    const exerciseTitle = `Exercise ${exerciseNumber}`;
    const exerciseDate = currentDate;
    const visibility = true; // Set visibility as needed

    const newExerciseDoc = await addDoc(exercisesRef, {
      title: exerciseTitle,
      date: exerciseDate,
      visibility: visibility,
    });

    // Initialize the messages subcollection for this exercise
    const messagesRef = collection(newExerciseDoc, "messages");
    await addDoc(messagesRef, {
      message: {
        role: "user",
        content: ``,
      },
      timestamp: serverTimestamp(),
      userId: null,
      isProfessor: false,
    });

    // Update ActiveExerciseDocId and store in localStorage
    ActiveExerciseDocId = newExerciseDoc.id;
    localStorage.setItem("ActiveExerciseDocId", ActiveExerciseDocId);
    console.log("New exercise created:", ActiveExerciseDocId);

    // Update the UI with the new exercise
    const exerciseList = document.querySelector(".exercise-list ul");
    const exerciseItem = document.createElement("li");
    exerciseItem.textContent = `${exerciseTitle} - ${exerciseDate}`;
    exerciseItem.setAttribute("doc-id", ActiveExerciseDocId); // Add the ID attribute
    exerciseList.appendChild(exerciseItem);
  } catch (error) {
    console.error("Error creating new exercise:", error);
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
  // Sort messages based on timestamp before rendering
  messages.sort((a, b) => a.timestamp - b.timestamp);
  console.log(messages);
} else {
  console.error("Active exercise document ID not found");
}

// Function to handle storage event
function handleStorageEvent(event) {
  if (event.key === "ActiveExerciseDocId") {
    ActiveExerciseDocId = event.newValue; // Update the ActiveExerciseDocId variable
    console.log(
      "ActiveExerciseDocId updated from localStorage:",
      ActiveExerciseDocId
    );
    // Now you can perform any additional actions or updates based on the new value
  }
}

// Listen for storage events
window.addEventListener("storage", handleStorageEvent);

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const user = auth.currentUser; // Get the current user
    await determineEndpoint(); // Call the function to determine the endpoint

    const userMessage = formInput.value;
    const newUserMessage = { role: "user", content: `${userMessage}` };
    messages.push(newUserMessage);

    // Check if ActiveExerciseDocId is null and create a new exercise
    if (!ActiveExerciseDocId) {
      await createNewExercise();
    }

    // Store the message in Firestore
    if (ActiveExerciseDocId) {
      await addMessageToFirestore(
        ActiveExerciseDocId,
        newUserMessage,
        user?.uid,
        user.isProfessor
      );
    } else {
      console.error("Active exercise document ID not found after creation");
      throw new Error("Failed to create or retrieve ActiveExerciseDocId");
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
        user?.uid,
        user.isProfessor
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
