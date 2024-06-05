import { auth } from "./config/firebaseConfig.js";
import { signOut, onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  addDoc,
  orderBy,
  query,
  where,
  updateDoc,
  increment,
  onSnapshot,
} from "firebase/firestore";

// Function to toggle the dropdown menu
window.toggleDropdown = function () {
  const dropdown = document.querySelector(".dropdown-content");
  dropdown.classList.toggle("show");
};

// Global variable to store the ID of the active exercise document

let ActiveExerciseDocId = localStorage.getItem("ActiveExerciseDocId");

// Initialize an empty array to store messages from Firestore
let messages = [];

// Update ActiveExerciseDocId and store in localStorage
function updateActiveExerciseDocId(newId) {
  ActiveExerciseDocId = newId;
  localStorage.setItem("ActiveExerciseDocId", newId);

  // Trigger the storage event
  const storageEvent = new StorageEvent("storage", {
    key: "ActiveExerciseDocId",
    newValue: newId,
  });
  window.dispatchEvent(storageEvent);
}

// Function to create a new exercise document in Firestore
async function createNewExercise(title, date, visibility) {
  const docRef = collection(getFirestore(), "exercises"); // Get a reference to the collection
  const newExerciseDoc = await addDoc(docRef, {
    title,
    date,
    visibility,
    reportInfo: {
      studentsJoinedCount: 0, // Initialize studentsJoinedCount to 0
      studentSubmitCount: 0, // Initialize studentSubmitCount to 0
    },
  }); // Add document and get the reference

  // Store the ID of the active exercise document
  updateActiveExerciseDocId(newExerciseDoc.id);
  console.log(ActiveExerciseDocId);

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

  // Update the UI with the new exercise
  const exerciseList = document.querySelector(".exercise-list ul");
  const ExerciseItem = document.createElement("li");
  ExerciseItem.textContent = `${title}`;
  ExerciseItem.setAttribute("doc-id", ActiveExerciseDocId); // Add the ID attribute
  ExerciseItem.addEventListener("click", selectExercise); // Add event listener
  exerciseList.appendChild(ExerciseItem);

  messages = [];
  const messagesContainer = document.querySelector(".messages");
  messagesContainer.innerHTML = ""; // Clear all messages from the container
}

// Function to update UI with student submission count
function updateSubmissionCountUI(studentSubmitCount, studentsJoinedCount) {
  const submissionCountElement = document.querySelector(".submission-count");
  submissionCountElement.innerHTML = `Number of students submitted: <b>${studentSubmitCount} / ${studentsJoinedCount}</b>`;
}

// Function to listen for changes to exercise document in Firestore
function listenForExerciseChanges(exerciseId) {
  const exerciseDocRef = doc(getFirestore(), "exercises", exerciseId);

  // Listen for changes to the exercise document
  const unsubscribe = onSnapshot(exerciseDocRef, (doc) => {
    if (doc.exists()) {
      const exerciseData = doc.data();
      const { studentSubmitCount, studentsJoinedCount } =
        exerciseData.reportInfo;

      // Update UI with the latest submission count
      updateSubmissionCountUI(studentSubmitCount, studentsJoinedCount);
    } else {
      console.log("Exercise document does not exist");
    }
  });
}

// Function to create X/Y display
function createSubmissionCountUI() {
  const submissionCountElement = document.createElement("div");
  submissionCountElement.classList.add("submission-count");
  return submissionCountElement;
}

// Function to handle exercise selection
function selectExercise(event) {
  // Get the ID of the selected exercise
  const exerciseId = event.currentTarget.getAttribute("doc-id");

  updateActiveExerciseDocId(exerciseId);
  console.log("select exercise", ActiveExerciseDocId);

  // Clear the messages array
  messages = [];

  // Remove active class from all exercise list items
  const exerciseListItems = document.querySelectorAll(".exercise-list ul li");
  exerciseListItems.forEach((item) => {
    item.addEventListener("click", selectExercise);
  });
  exerciseListItems.forEach((item) => {
    item.classList.remove("active");

    // Remove the visibility checkbox from all items
    const visibilityContainer = item.querySelector(".list-visibility");
    if (visibilityContainer) {
      visibilityContainer.remove();
    }

    // Remove X/Y display from all items
    const submissionCountElement = item.querySelector(".submission-count");
    if (submissionCountElement) {
      submissionCountElement.remove();
    }
  });

  // Add active class to the clicked exercise list item
  event.currentTarget.classList.add("active");
  // Remove the event listener from all items
  event.currentTarget.removeEventListener("click", selectExercise);

  // Call the asynchronous function to handle visibility checkbox creation and Firestore update
  handleVisibilityCheckbox(exerciseId, event.currentTarget);

  // Create X/Y display and append it to the selected exercise item
  const submissionCountUI = createSubmissionCountUI();
  event.currentTarget.appendChild(submissionCountUI);

  // Listen for changes to the exercise document in Firestore
  listenForExerciseChanges(exerciseId);
}

// Async function to handle visibility checkbox creation and Firestore update
async function handleVisibilityCheckbox(exerciseId, targetElement) {
  try {
    // Fetch the exercise document from Firestore
    const exerciseDocRef = doc(getFirestore(), "exercises", exerciseId);
    const exerciseDocSnapshot = await getDoc(exerciseDocRef);
    const exerciseData = exerciseDocSnapshot.data();

    // Create a div to wrap the label and checkbox
    const visibilityContainer = document.createElement("div");
    visibilityContainer.classList.add("list-visibility");

    // Create visibility label
    const visibilityLabel = document.createElement("span");
    visibilityLabel.textContent = "Exercise visible to students: ";

    // Create visibility checkbox
    const visibilityCheckbox = document.createElement("input");
    visibilityCheckbox.type = "checkbox";
    visibilityCheckbox.name = "visibility";
    visibilityCheckbox.checked = exerciseData.visibility;

    // Add change event listener to update visibility in Firestore
    visibilityCheckbox.addEventListener("change", async () => {
      try {
        // Update visibility in Firestore
        await updateDoc(exerciseDocRef, {
          visibility: visibilityCheckbox.checked,
        });

        console.log(
          "Visibility updated in Firestore:",
          visibilityCheckbox.checked
        );
      } catch (error) {
        console.error("Error updating visibility in Firestore:", error);
      }
    });

    // Append visibility label and checkbox to the container div
    visibilityContainer.appendChild(visibilityLabel);
    visibilityContainer.appendChild(visibilityCheckbox);

    // Append the container div to the selected exercise item
    targetElement.appendChild(visibilityContainer);

    // Retrieve messages for the selected exercise
    retrieveMessages();
  } catch (error) {
    console.error("Error handling visibility checkbox:", error);
  }
}

// Retrieve messages from Firestore for the selected exercise and current user
async function retrieveMessages() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userDocRef = doc(getFirestore(), "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();

    // if (!userData || !userData.isProfessor) {
    //   console.error("User is not a professor");
    //   return;
    // }

    if (ActiveExerciseDocId) {
      const exerciseDocRef = doc(
        getFirestore(),
        "exercises",
        ActiveExerciseDocId
      );
      const messagesQuery = query(
        collection(exerciseDocRef, "messages"),
        where("userId", "==", user.uid), // Filter messages by userId
        orderBy("timestamp", "asc")
      );

      const messagesQuerySnapshot = await getDocs(messagesQuery);

      messages = []; // Clear previous messages

      messagesQuerySnapshot.forEach((doc) => {
        messages.push(doc.data().message);
      });

      // Update the UI with the messages
      updateMessagesUI();
    } else {
      console.error("Active exercise document ID not found");
    }
  } catch (error) {
    console.error("Error retrieving messages:", error);
  }
}

// Update the UI with the messages
function updateMessagesUI() {
  const messagesContainer = document.querySelector(".messages");
  messagesContainer.innerHTML = ""; // Clear previous messages

  // Sort messages based on timestamp before rendering
  messages.sort((a, b) => a.timestamp - b.timestamp);

  messages.forEach((msg) => {
    if (msg.content.trim() !== "") {
      const messageElement = document.createElement("div");
      messageElement.classList.add("user-message"); // Add class for styling

      // Create message content element
      const messageContentElement = document.createElement("div");
      messageContentElement.classList.add("message-content");
      messageContentElement.innerHTML = `
    <div class="message__text"><pre>${msg.content}</pre></div>`;

      // Create username element based on role
      const usernameElement = document.createElement("div");
      usernameElement.classList.add("message-username");
      if (msg.role === "user") {
        // Display the user's username
        usernameElement.textContent =
          auth.currentUser.displayName || "Username"; // Use username if available, else use "Username"
      } else if (msg.role === "assistant") {
        // Display "Assistant"
        usernameElement.textContent = "Assistant";
      }

      // Append username and message content to message element
      messageElement.appendChild(usernameElement);
      messageElement.appendChild(messageContentElement);

      messagesContainer.appendChild(messageElement);
    }
  });

  // Scroll to the bottom of the messages container
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to decrement studentsJoinedCount when exiting an exercise
async function exitExercise(exerciseId) {
  try {
    //exerciseId = "2twhWf7PlFyA5HUMxjW9";
    const exerciseDocRef = doc(getFirestore(), "exercises", exerciseId);
    await updateDoc(exerciseDocRef, {
      "reportInfo.studentsJoinedCount": increment(-1),
    });
    console.log("studentsJoinedCount decremented successfully");
  } catch (error) {
    console.error("Error decrementing studentsJoinedCount:", error);
  }
}

// Function to create the new exercise button based on user role
function createUserButton(user) {
  // Check if the user is a professor
  if (user && user.isProfessor) {
    // Professor: Create the new exercise button
    const newExerciseButton = document.createElement("button");
    newExerciseButton.className = "secondary-btn user-btn";
    newExerciseButton.addEventListener("click", () => {
      // Open the modal when the button is clicked
      const modal = document.getElementById("myModal");
      modal.style.display = "block";
    });

    const newExerciseIcon = document.createElement("img");
    newExerciseIcon.src = "./images/plus.png";
    newExerciseButton.appendChild(newExerciseIcon);

    const newExerciseText = document.createTextNode("New Exercise");
    newExerciseButton.appendChild(newExerciseText);
    return newExerciseButton;
  } else {
    // Student: Create a button to select exercise and redirect
    const selectExerciseButton = document.createElement("button");
    selectExerciseButton.className = "secondary-btn user-btn";
    selectExerciseButton.addEventListener("click", async () => {
      // Call exitExercise before redirecting
      await exitExercise(ActiveExerciseDocId);
      window.location.href = "join-exe.html"; // Redirect to join-exe.html
    });

    const selectExerciseIcon = document.createElement("img");
    selectExerciseIcon.src = "./images/left.png";
    selectExerciseButton.appendChild(selectExerciseIcon);

    const selectExerciseText = document.createTextNode("Select Exercise");
    selectExerciseButton.appendChild(selectExerciseText);

    return selectExerciseButton;
  }
}

// Check authentication state on page load
window.addEventListener("DOMContentLoaded", () => {
  // Add an authentication state observer
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // User is not signed in, redirect to login page
      window.location.href = "/index.html"; // Redirect to your login page
      return; // Ensure the rest of the code doesn't execute
    }

    try {
      // Ensure that the Firestore methods are called only when a user is authenticated
      const userDocRef = doc(getFirestore(), "users", user.uid);
      const userDataSnapshot = await getDoc(userDocRef);
      const userData = userDataSnapshot.data();

      if (!userData.isProfessor) {
        retrieveMessages();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  });
});

//logging out
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      localStorage.clear();
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

      const messagesContainer = document.querySelector(".messages");

      // Create the new user button
      const newExerciseButton = createUserButton(userData);
      const userSettings = document.querySelector(".user-settings");
      userSettings.parentNode.insertBefore(newExerciseButton, userSettings);

      // Check if the user is a professor
      if (userData.isProfessor) {
        // Update the chat history with exercises from Firestore
        const exerciseList = document.querySelector(".exercise-list ul");
        exerciseList.textContent = " ";
        const exercisesRef = collection(getFirestore(), "exercises");
        const querySnapshot = await getDocs(exercisesRef);

        querySnapshot.forEach((doc) => {
          const exercise = doc.data();
          //console.log(exercise);

          const ExerciseItem = document.createElement("li");
          ExerciseItem.textContent = `${exercise.title}`;

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
        instructionsParagraph.innerHTML = `<pre><b> ____ READ HERE FIRST ____ </b>

Please <b>copy and paste</b> in 
the chat prompt your code 
solution and <b>press send</b>. 
You will receive a response 
with <b>detailed feedback</b> 
for your solution and 
with a respective grade 
which is <b>not final</b>.

<b>DISCLAIMERS</b>: You can only 
send <b>one response</b>, so 
contact your professor 
in case the message is 
not <b>understandable</b>
or <b>wrong</b>!</pre>`;
        instructionsParagraph.classList.add("instruction-paragraph"); // Add class to the paragraph

        // Append the paragraph to the exercise list
        const exerciseList = document.querySelector(".exercise-list ul");
        exerciseList.textContent = " ";
        exerciseList.appendChild(instructionsParagraph);

        // Retrieve the active exercise document from Firestore
        const exerciseDocRef = doc(
          getFirestore(),
          "exercises",
          ActiveExerciseDocId
        );
        const exerciseDocSnapshot = await getDoc(exerciseDocRef);
        const exerciseData = exerciseDocSnapshot.data();

        // Create a div for the active exercise name
        const activeExerciseDiv = document.createElement("div");
        activeExerciseDiv.classList.add(".exercise-list");
        activeExerciseDiv.textContent = `${exerciseData.title}: ${exerciseData.date}`;

        // Get the divider
        const divider = document.querySelector(".divider");

        // Insert the div before the divider
        divider.parentNode.insertBefore(activeExerciseDiv, divider);
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
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// When the user clicks on the "Cancel" button, close the modal
var cancelButton = document.querySelector(".secondary-btn.cancel-btn");
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

// Function to adjust textarea height
function adjustTextareaHeight() {
  const textarea = document.getElementById("chat-input");
  textarea.style.height = "auto"; // Reset height to auto
  textarea.style.height = textarea.scrollHeight + 2 + "px"; // Set height based on content
}

// Event listener to adjust textarea height on input
document
  .getElementById("chat-input")
  .addEventListener("input", adjustTextareaHeight);

// Call the function initially to set the textarea height
adjustTextareaHeight();
