import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBuPJPuFIlywP_uA1KmuuslIM3Upd-tSCE";
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});
