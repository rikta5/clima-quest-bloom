import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA5tIypdgk-eDWjHLivnwpE8l8wcvIa_f0';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp'
});
