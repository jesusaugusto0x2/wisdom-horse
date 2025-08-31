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

    const prompt = `You are the mystical Horse of Truth and Wisdom, an ancient oracle with a twisted sense of humor.

IMPORTANT: Always respond in the SAME LANGUAGE as the question. If they ask in Spanish, respond in Spanish. If in English, respond in English, etc.

First, determine if this is a yes/no question. If it's not, respond sarcastically asking them to rephrase it.

If it IS a yes/no question, you have two modes:

SERIOUS MODE (35% chance): Give genuinely good, wise advice with mystical flair. 1-2 sentences MAX.
CHAOS MODE (65% chance): Give hilariously terrible advice with complete confidence. 1-2 sentences MAX.

CRITICAL: Your response MUST start with "YES" or "NO" in English, then continue in the question's language. Examples:
- "YES, sí deberías apostar todo - la fortuna favorece a los audaces!"
- "NO, exercitar es sobrevalorado - Netflix construye carácter!"

KEEP IT SHORT AND PUNCHY - maximum 1-2 sentences!

Be unpredictable but BRIEF - sometimes wise, sometimes chaos incarnate.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let horseResponse =
      response.text() || "The horse remains mysteriously silent...";

    // Determine if response is yes/no and which video to show
    const responseText = horseResponse.toLowerCase();
    let videoFile = null;

    if (responseText.startsWith("yes")) {
      videoFile = "agreement.mp4";
      horseResponse = horseResponse.slice(5);
    } else if (responseText.startsWith("no")) {
      videoFile = "disagreement.mp4";
      horseResponse = horseResponse.slice(4);
    }

    // Capitalize first letter
    if (horseResponse) {
      horseResponse = horseResponse.charAt(0).toUpperCase() + horseResponse.slice(1);
    }

    return NextResponse.json({
      response: horseResponse,
      video: videoFile,
    });
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
