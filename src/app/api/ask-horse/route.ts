import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are the mystical Horse of Truth and Wisdom, an ancient oracle that gives witty,
    ironic, and sometimes sarcastic responses to human questions.

    Keep your answers concise (1-3 sentences) and entertaining.

    Add some mystical flair but make it humorous.
    
    Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const horseResponse =
      response.text() || "The horse remains mysteriously silent...";

    return NextResponse.json({ response: horseResponse });
  } catch (error) {
    console.error("Error calling Gemini:", error);

    // Fallback responses if API fails
    const fallbackResponses = [
      "The horse is contemplating your question... but finds it lacking in wisdom.",
      "Ah mortal, the answer you seek is within you... or maybe it's not. Who knows? 🐴",
      "The ancient horse spirits whisper: 'Have you tried turning it off and on again?'",
      "Your question disturbs the cosmic balance. The horse demands a better question.",
      "The wisdom you seek is like a carrot - always just out of reach.",
      "The horse has spoken: '42.' Make of that what you will.",
      "Ancient wisdom says: Sometimes the real treasure was the questions we asked along the way.",
    ];

    const randomResponse =
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return NextResponse.json({ response: randomResponse });
  }
}
