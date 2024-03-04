import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import openai from "../src/config/openaiConfig.js";
import cors from "cors";

const app = express();

// Middleware to parse JSON data and populate req.body
app.use(express.json());
app.use(express.static("public"));

export const generateMeta = onRequest(async (req, res) => {
  const { title } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Come up with a description for a YouTube video called ${title}`,
      },
    ],
    max_tokens: 100,
  });

  console.log(description.choices[0].message);

  res.status(200).json({
    description: description.choices[0].message,
  });
});
