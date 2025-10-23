import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mystic-oracle.netlify.app",
      "https://mystic-oracle-app.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from Groq API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("🟢 Mystic Oracle backend is alive!");
});

app.listen(process.env.PORT || 5000, () =>
  console.log("✅ Proxy running on http://localhost:5000")
);
