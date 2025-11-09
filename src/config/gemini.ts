import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBfo7LicpUTl7PXx5mPDNGB2adtqZVE114";
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});
