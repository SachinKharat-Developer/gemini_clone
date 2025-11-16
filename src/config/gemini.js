

import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyBVRqw4j07DChPTvxV2U7Xi3l4u5Twji08';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function runChat(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}

export default runChat;
