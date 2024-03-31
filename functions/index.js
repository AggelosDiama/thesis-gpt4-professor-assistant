import { onRequest } from "firebase-functions/v2/https";
import openai from "../src/config/openaiConfig.js";

export const professorChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", //3.5 for FE testing, change later to 4
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

export const professorReportChatRule = onRequest(async (req, res) => {
  const { messages } = req.body;

  const description = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", //3.5 for FE testing, change later to 4
    messages: [
      {
        role: "system",
        content: `As an experienced university professor specializing in computer language programming, you have been provided with feedback and grades from students who completed the same programming exercise. Your task is to analyze this data comprehensively and generate a report assessing how the entire group performed. Specifically, evaluate where they succeeded, where they faced challenges or errors, identify areas requiring revision in their understanding of the programming language, and calculate the average grade achieved by the group. Your insights will help in understanding the overall performance and learning gaps in the student group's programming skills.`,
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
