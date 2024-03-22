import { onRequest } from "firebase-functions/v2/https";
import openai from "../src/config/openaiConfig.js";

export const professorChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-4", //3.5 for FE testing, change later to 4
    messages: [
      {
        role: "system",
        content: `You are an expert university professor with specialty on computer language programming.`,
      },
      ...messages,
    ],
    max_tokens: 1000,
  });

  // let exerciseHtml = description.choices[0].message.content;

  res.status(200).send(description.choices[0].message.content);
});

export const studentChatRule = onRequest(async (req, res) => {
  const { userInput } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", //3.5 for FE testing, change later to 4
    messages: [
      {
        role: "system",
        content: `You are an expert university professor with specialty on computer language programming. Provide feedback to the university student on their programming language exercises.`,
      },
      {
        role: "user",
        content: `Provide feedback for the following Python code:${userInput}. Give the feedback in an HTML format, meaning to wrap elements with p tags, add break lines when needed and add text decorations with bold tags. Don't add <html>, <body> or other tags, only the ones related to text.`,
      },
    ],
    max_tokens: 1000,
  });

  let feedbackHtml = description.choices[0].message.content;

  res.status(200).json(feedbackHtml);
});
