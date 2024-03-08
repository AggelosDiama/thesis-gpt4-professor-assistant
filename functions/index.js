import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import openai from "../src/config/openaiConfig.js";
import cors from "cors";

const app = express();

// Middleware to parse JSON data and populate req.body
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5002/",
//   })
// ); // Add this line to enable CORS for all routes
app.use(express.static("public"));

export const studentChatRule = onRequest(async (req, res) => {
  const { code } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert university professor with specialty on computer language programming. Provide feedback to the university student on their programming language exercises.`,
      },
      {
        role: "user",
        content: `Provide feedback for the following Python code:${code}. Give the feedback in an HTML format, meaning to wrap elements with p tags, add break lines when needed and add text decorations with bold tags. Don't add <html>, <body> or other tags, only the ones related to text.`,
      },
    ],
    max_tokens: 1000,
  });

  const feedbackHtml = description.choices[0].message.content;

  console.log(feedbackHtml);

  // Send the HTML-formatted feedback
  res.status(200).send(feedbackHtml);
});

// Function to format the feedback message into HTML
function formatFeedback(message) {
  // Check if the message is a string
  if (typeof message !== "string") {
    // If not a string, convert it to a string
    message = String(message);
  }

  // Example formatting: wrap in paragraph tags and add line breaks
  return `<p>${message.replace(/\n/g, "<br>")}</p>`;
}
