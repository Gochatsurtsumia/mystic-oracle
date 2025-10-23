import { useState } from "react";
import "./app.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const API_URL = import.meta.env.VITE_GROQ_API_URL;

  async function generateText() {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `You are a mystical fortune teller oracle.

User input: "${prompt}"

RULES:
- If the input asks about future, fate, fortune, destiny, or life: Give a mysterious 2-3 sentence prediction
- If the input is anything else (greeting, random word, statement): Reply EXACTLY with "🔮 The oracle only reveals the future. Ask your question..."

User input: "${prompt}"

Your response:`,
            },
          ],
          max_tokens: 120,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 429) {
          throw new Error("The oracle is overwhelmed. Please wait a moment...");
        } else if (response.status === 500) {
          throw new Error("The spirits are restless. Try again soon...");
        } else {
          throw new Error(
            `Error ${response.status}: ${
              errorData?.error?.message || "Unknown error"
            }`
          );
        }
      }

      const data = await response.json();
      setText(data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      setText(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h2 className="oracle-title">Mystic Oracle</h2>

      <form className="oracle-form" onSubmit={(e) => e.preventDefault()}>
        <label className="form-label">Ask the Oracle About Your Destiny</label>
        <input
          value={prompt}
          type="text"
          className="oracle-input"
          placeholder="What does the future hold for me?"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && prompt.trim() && !loading) {
              generateText();
            }
          }}
        />
      </form>

      <button
        onClick={generateText}
        disabled={loading || !prompt.trim()}
        className={`oracle-button ${loading ? "loading" : ""}`}
      >
        {loading ? "✨ Consulting the Stars..." : "🔮 Hear Your Fate"}
      </button>

      <div className="fortune-container">
        <p className={`fortune-text ${text.includes("⚠️") ? "error" : ""}`}>
          {text}
        </p>
      </div>
    </div>
  );
}

export default App;
