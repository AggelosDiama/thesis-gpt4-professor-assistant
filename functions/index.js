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
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", //3.5 for FE testing, change later to 4
    messages: [
      {
        role: "system",
        content: `You are an expert university professor with specialty on computer language programming. Provide feedback to the university student on their programming language exercises.`,
      },
      {
        role: "user",
        content: `According to the following messages, get the code exercise, the evalaution criteria and finally my solution to the code and give me feedback for improvements and mistakes and grade me from 1 to 10 according to the criteria`,
      },
      ...messages,
    ],
    max_tokens: 1000,
  });

  let feedbackHtml = description.choices[0].message.content;

  res.status(200).json(feedbackHtml);
});
