"use client";

import { useState } from "react";

export default function Page() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askHorse = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ask-horse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("The horse is mysteriously silent... try again mortal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-300">
            🐴 HORSE OF TRUTH AND WISDOM 🐴
          </h1>
          <p className="text-xl md:text-2xl text-purple-200">
            Ask me anything, mortal... and I shall bestow upon thee the wisdom
            of ages!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What wisdom do you seek, mortal?"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-800 border-2 border-purple-500 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && askHorse()}
            />
          </div>
          <button
            onClick={askHorse}
            disabled={loading || !question.trim()}
            className="w-full py-3 px-6 text-xl font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {loading ? "THE HORSE CONTEMPLATES..." : "ASK THE HORSE"}
          </button>
          {response && (
            <div className="mt-8 p-6 bg-gray-800 rounded-lg border-2 border-yellow-400">
              <p className="text-yellow-300 font-bold mb-2">
                The Horse speaks:
              </p>
              <p className="text-lg text-white leading-relaxed">{response}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
