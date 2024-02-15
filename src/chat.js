// Forms
const chatForm = document.getElementById("chat-form");
const formInput = document.getElementById("chat-input");

// Output elements
const messagesContainer = document.querySelector(".messages");
const messages = messagesContainer.querySelector("p");

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

    // Create a new paragraph element for the response message
    const responseMessageElement = document.createElement("p");

    // Fetch response message from server...
    const res = await fetch(
      "http://127.0.0.1:5001/thesis-77e2b/us-central1/generateMeta",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formInput.value }),
        method: "POST",
        mode: "cors",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    console.log(data.description);

    // Create a new paragraph element for the message
    const newMessage = document.createElement("p");
    newMessage.textContent =
      data.description.content || "No description available";

    // Append the new message to the messages container
    messagesContainer.appendChild(newMessage);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
