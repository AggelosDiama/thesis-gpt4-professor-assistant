import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({
  organization: "org-8QSweNVyi2jKHL8eDdFhyIJE",
  path: "/Users/aggelos/Documents/CEID/Thesis/thesis-gpt4-professor-assistant-1/.env",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
