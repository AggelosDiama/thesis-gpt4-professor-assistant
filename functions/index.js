import { onRequest } from "firebase-functions/v2/https";
import openai from "../src/config/openaiConfig.js";

export const professorChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo" //uncomment for FE testing
    model: "gpt-4", //default
    messages: [
      {
        role: "system",
        content: `You are an expert greek university professor with specialty on computer language programming.`,
      },
      ...messages,
    ],
    max_tokens: 1000,
  });

  res.status(200).send(description.choices[0].message.content);
});

export const professorReportChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo" //uncomment for FE testing
    model: "gpt-4", //default
    messages: [
      {
        role: "system",
        content: `As an experienced greek university professor specializing in computer language programming, you have been provided with feedback and grades from students who completed the same programming exercise. Your task is to analyze this data comprehensively and generate a report assessing how the entire group performed.`,
      },
      {
        role: "user",
        content: `According to the following messages, can you sum up the feedback that the students got for their code solutions and give me their grades with their mean value as well.`,
      },
      ...messages,
    ],
    max_tokens: 1000,
  });

  res.status(200).send(description.choices[0].message.content);
});

export const studentChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo" //uncomment for FE testing
    model: "gpt-4", //default
    messages: [
      {
        role: "system",
        content: `You are an expert greek university professor with specialty on computer language programming. Provide feedback to the university student on their programming language exercises.`,
      },
      {
        role: "user",
        content: `According to the following messages, get the code exercise, the evalaution criteria and finally my solution to the code and give me feedback for improvements and mistakes and grade me from 1 to 10 according to the criteria.`,
      },
      ...messages,
    ],
    max_tokens: 1500,
  });

  res.status(200).send(description.choices[0].message.content);
});
