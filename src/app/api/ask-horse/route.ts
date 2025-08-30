import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const prompt = `You are the mystical Horse of Truth and Wisdom, an ancient oracle that gives witty, ironic, and sometimes sarcastic responses to human questions. Keep your answers concise (1-3 sentences) and entertaining. Add some mystical flair but make it humorous.
      Question: ${question}
      Horse's wise response:`;

    const response = await hf.textGeneration({
      model: "microsoft/DialoGPT-medium",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.8,
        do_sample: true,
        return_full_text: false,
      },
    });

    // Clean up the response
    let horseResponse =
      response.generated_text?.trim() ||
      "The horse remains mysteriously silent...";

    // Remove any duplicate prompt text
    if (horseResponse.includes("Horse's wise response:")) {
      horseResponse =
        horseResponse.split("Horse's wise response:")[1]?.trim() ||
        horseResponse;
    }

    return NextResponse.json({ response: horseResponse });
  } catch (error) {
    console.error("Error calling Hugging Face:", error);

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
