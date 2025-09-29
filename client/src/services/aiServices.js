import axios from "axios";

export async function askAi(question) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/ask`,
      {
        question,
      }
    );
    return res.data.answer; // backend returns { answer }
  } catch (err) {
    console.error("AI request failed:", err);
    throw err.response?.data?.error || "AI request failed";
  }
}
