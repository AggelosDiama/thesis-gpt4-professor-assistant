// forms
const metaForm = document.getElementById("chat-form");

// output elements
const messages = document.querySelector(".messages p");

metaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("gamo");

  const res = await fetch(
    "http://127.0.0.1:5001/thesis-77e2b/us-central1/generateMeta",
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: metaForm.title.value }),
      method: "POST",
      mode: "cors",
    }
  );
  const data = await res.json();

  console.log(data);

  messages.textContent = data.messages.content;
});
