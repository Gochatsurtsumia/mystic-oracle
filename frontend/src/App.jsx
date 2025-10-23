import { useState } from "react";
import "./app.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [fading, setFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  async function generateText() {
    if (!prompt.trim()) return;
    setLoading(true);
    setFading(true);
    setTimeout(() => setText(""), 200);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `You are a mystical fortune teller oracle.

User input: "${prompt}"

RULES:
- If the input asks about future, fate, fortune, destiny, or life: Give a mysterious 2–3 sentence prediction.
- If the input is anything else (greeting, random word, statement): Reply EXACTLY with "🔮 The oracle only reveals the future. Ask your question..."
`,
            },
          ],
          max_tokens: 120,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 API response:", data);

      // Defensive parsing — guarantees no crash
      const newText =
        data?.choices?.[0]?.message?.content ||
        data?.message ||
        data?.error?.message ||
        "⚠️ The oracle is silent...";

      setTimeout(() => {
        setText(newText);
        setFading(false);
        const fortuneElement = document.querySelector(".fortune-container");
        if (fortuneElement) {
          fortuneElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    } catch (error) {
      console.error("Error:", error);
      setText(`⚠️ ${error.message}`);
      setFading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="contact-bar">
        <a href="tel:+995571103081">📞 +995571103081</a>
        <a href="mailto:gochatsurtsumia05@gmail.com">📧 Gmail</a>
        <a
          href="https://www.linkedin.com/in/gocha-tsurtsumia-3ba89a277/"
          target="_blank"
          rel="noreferrer"
        >
          💼 LinkedIn
        </a>
        <a
          href="https://github.com/Gochatsurtsumia"
          target="_blank"
          rel="noreferrer"
        >
          🐙 GitHub
        </a>
      </div>

      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <h3>Contact the Oracle (Gocha)</h3>
        <ul>
          <li>
            📞 <a href="tel:+995571103081">+995571103081</a>
          </li>
          <li>
            📧{" "}
            <a href="mailto:gochatsurtsumia05@gmail.com">
              gochatsurtsumia05@gmail.com
            </a>
          </li>
          <li>
            💼{" "}
            <a
              href="https://www.linkedin.com/in/gocha-tsurtsumia-3ba89a277/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            🐙{" "}
            <a
              href="https://github.com/Gochatsurtsumia"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>

      <h2 className="oracle-title">Mystic Oracle</h2>

      <form
        className="oracle-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) generateText();
        }}
      >
        <label className="form-label">Ask the Oracle About Your Destiny</label>
        <input
          value={prompt}
          type="text"
          className="oracle-input"
          placeholder="What does the future hold for me?"
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
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
        <p
          className={`fortune-text ${text.includes("⚠️") ? "error" : ""} ${
            fading ? "fade-out" : "fade-in"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default App;
