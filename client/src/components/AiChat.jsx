// src/components/AiChat.jsx
import { useState } from "react";
import { askAi } from "../services/aiServices";

export default function AiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleQuestions = [
    "Show me all SUVs",
    "List Sedans below 2000",
    "Who booked the BMW X5?",
    "Available cars under 3000",
    "Show bookings for SUVs",
    "List cars booked by John",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const answer = await askAi(prompt);
      setResponse(answer || "No response from AI");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-6 tracking-wide text-center">
        🤖 AI Assistant
      </h2>

      {/* Example Questions */}
      <div className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl mb-6 w-full max-w-2xl shadow-lg border border-cyan-600">
        <p className="font-semibold text-cyan-300 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(q)}
              className="px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-200 hover:bg-cyan-500/50 hover:text-white transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 w-full max-w-2xl mb-4"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 px-4 py-3 rounded-xl bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-400 mb-4 font-semibold text-center">{error}</p>
      )}

      {/* Response Card */}
      {response && (
        <div className="w-full max-w-2xl p-6 rounded-2xl bg-gray-800/50 backdrop-blur-md border border-cyan-400 shadow-xl text-gray-100">
          <p className="font-semibold text-cyan-300 mb-2">AI Response:</p>
          <p className="whitespace-pre-line text-lg">{response}</p>
        </div>
      )}
    </div>
  );
}
