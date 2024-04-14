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
  updateDoc,
} from "firebase/firestore"; // Import Firestore functions

// Forms
const chatForm = document.getElementById("input-container");
const formInput = document.getElementById("chat-input");
const messagesContainer = document.querySelector(".messages");

let ActiveExerciseDocId = localStorage.getItem("ActiveExerciseDocId");

// Initialize an empty array to store messages from Firestore
let messages = [];

// Initialize flags and counts
let studentsJoinedCount;
let studentSubmitCount;

// Initialize counts from Firestore
async function initializeCountsFromFirestore() {
  try {
    const exerciseDocRef = doc(
      getFirestore(),
      "exercises",
      ActiveExerciseDocId
    );
    const exerciseDocSnapshot = await getDoc(exerciseDocRef);
    const exerciseData = exerciseDocSnapshot.data();

    if (exerciseData) {
      studentsJoinedCount = exerciseData.reportInfo.studentsJoinedCount || 0;
      studentSubmitCount = exerciseData.reportInfo.studentSubmitCount || 0;
    }
  } catch (error) {
    console.error("Error initializing counts from Firestore:", error);
  }
}

// Call the function to initialize counts from Firestore
// initializeCountsFromFirestore();

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

    if (!userData.isProfessor) {
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
        messages.push(doc.data().message);
      });
      console.log(messages);
    }
  }
};

// Check counts and set flags
async function checkCountsAndFlags() {
  await initializeCountsFromFirestore();
  if (
    studentsJoinedCount > 0 &&
    studentSubmitCount > 0 &&
    studentsJoinedCount === studentSubmitCount
  ) {
    endpoint = "professorReportChatRule"; // Change endpoint
    console.log("All students have submitted. Endpoint changed.");

    const exerciseDocRef = doc(
      getFirestore(),
      "exercises",
      ActiveExerciseDocId
    );

    // Fetch messages where isProfessor is true and role is user
    const professorUserMessagesQuery = query(
      collection(exerciseDocRef, "messages"),
      where("isProfessor", "==", true)
    );
    const professorUserMessagesQuerySnapshot = await getDocs(
      professorUserMessagesQuery
    );

    // Fetch messages where isProfessor is false and role is assistant
    const nonProfessorAssistantMessagesQuery = query(
      collection(exerciseDocRef, "messages"),
      where("isProfessor", "==", false),
      where("message.role", "==", "assistant")
    );
    const nonProfessorAssistantMessagesQuerySnapshot = await getDocs(
      nonProfessorAssistantMessagesQuery
    );

    // Combine the messages from both queries
    messages = [];
    professorUserMessagesQuerySnapshot.forEach((doc) => {
      messages.push(doc.data().message);
    });
    nonProfessorAssistantMessagesQuerySnapshot.forEach((doc) => {
      messages.push(doc.data().message);
    });

    console.log(messages);
  }
}

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
      reportInfo: {
        studentsJoinedCount: 0, // Initialize studentsJoinedCount to 0
        studentSubmitCount: 0, // Initialize studentSubmitCount to 0
      },
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
    exerciseItem.textContent = `${exerciseTitle}`;
    exerciseItem.setAttribute("doc-id", ActiveExerciseDocId); // Add the ID attribute
    exerciseList.appendChild(exerciseItem);
  } catch (error) {
    console.error("Error creating new exercise:", error);
  }
}

let defaultMessage;

// Function to display initial message to the user
async function defaultMessageUI() {
  try {
    const user = auth.currentUser; // Get the current user
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userDocRef = doc(getFirestore(), "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();

    const messagesContainer = document.querySelector(".messages");
    // Check if the messages container is empty
    if (!messagesContainer.innerHTML.trim()) {
      const defaultMessageElement = document.createElement("div");
      defaultMessageElement.classList.add("default-message");

      let defaultMessage = "";
      if (userData.isProfessor) {
        defaultMessage =
          "Begin a new exercise by typing below or select from the existing exercises on the left.";
      } else {
        defaultMessage =
          "Read the instruction on the left before you submit your solution.";
      }

      defaultMessageElement.textContent = defaultMessage;

      messagesContainer.appendChild(defaultMessageElement);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Call the function to display the default message with a delay when the file loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(defaultMessageUI, 2000); // Delay of 500 milliseconds to load the user first
});

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
    console.log(auth.currentUser);

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userDocRef = doc(getFirestore(), "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();

    const userMessage = formInput.value;
    const newUserMessage = { role: "user", content: `${userMessage}` };
    messages.push(newUserMessage);

    // Check if ActiveExerciseDocId is null and create a new exercise
    if (!ActiveExerciseDocId) {
      await createNewExercise();
    }

    // Increment studentSubmitCount if user is a student
    if (user && !userData.isProfessor) {
      studentSubmitCount++;
      await updateStudentSubmitCount(); // Update Firestore count
    }

    // Store the message in Firestore
    if (ActiveExerciseDocId) {
      await addMessageToFirestore(
        ActiveExerciseDocId,
        newUserMessage,
        user?.uid,
        userData.isProfessor
      );
    } else {
      console.error("Active exercise document ID not found after creation");
      throw new Error("Failed to create or retrieve ActiveExerciseDocId");
    }

    // Empty the default message
    const messagesContainer = document.querySelector(".messages");
    while (messagesContainer.firstChild) {
      messagesContainer.removeChild(messagesContainer.firstChild);
    }

    formInput.value = "";

    // Create a new paragraph element for the user's input
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message"); // Add a class for styling

    // Create username element
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("message-username");
    usernameElement.textContent = user.displayName || "Username"; // Use user's display name if available, else use "Username"

    // Create message content element
    const messageContentElement = document.createElement("div");
    messageContentElement.classList.add("message-content");
    messageContentElement.innerHTML = `
    <div class="message__text"><pre>${userMessage}</pre></div>`;

    // Append profile picture, username, and message content to message details
    userMessageElement.appendChild(usernameElement);
    userMessageElement.appendChild(messageContentElement);
    messagesContainer.appendChild(userMessageElement);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    //console.log(messages);

    // Run checkCountsAndFlags only if the user is a professor
    if (user && userData.isProfessor) {
      await checkCountsAndFlags();
    }

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
        userData.isProfessor
      );
    } else {
      console.error("Active exercise document ID not found");
    }

    console.log(assistantMessage);

    // Create a new div element for the message
    const assistantMessageElement = document.createElement("div");
    assistantMessageElement.classList.add("user-message"); // Add a class for styling

    // Create username element
    const assistantNameElement = document.createElement("div");
    assistantNameElement.classList.add("message-username");
    assistantNameElement.textContent = "Assistant"; // Set the username as "Assistant"

    // Create message content element
    const assistantMessageContentElement = document.createElement("div");
    assistantMessageContentElement.classList.add("message-content");
    assistantMessageContentElement.innerHTML = `
    <div class="message__text"><pre>${assistantMessage}</pre></div>`;

    // Append profile picture, username, and message content to message details
    assistantMessageElement.appendChild(assistantNameElement);
    assistantMessageElement.appendChild(assistantMessageContentElement);
    messagesContainer.appendChild(assistantMessageElement);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const submitButton = document.querySelector(".main-btn");
    // Disable textarea and change placeholder text if user is not a professor
    if (!userData.isProfessor) {
      formInput.disabled = true;
      formInput.placeholder =
        "You can't send more messages, please refer to your professor for questions";
      submitButton.disabled = true;
    }

    chatForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Function to update studentSubmitCount in Firestore
async function updateStudentSubmitCount() {
  try {
    const exerciseDocRef = doc(
      getFirestore(),
      "exercises",
      ActiveExerciseDocId
    );
    await updateDoc(exerciseDocRef, {
      "reportInfo.studentSubmitCount": studentSubmitCount,
    });
    console.log("studentSubmitCount updated successfully");
  } catch (error) {
    console.error("Error updating studentSubmitCount:", error);
  }
}
