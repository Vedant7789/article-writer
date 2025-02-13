import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const GOOGLE_AI_API_KEY=process.env.GOOGLE_AI_API_KEY;


const PORT=process.env.PORT||5001;
app.listen(PORT,()=>console.log(`Server running on ${PORT}`));

async function getGeminiResponse(prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`;

    const response = await axios.post(API_URL, {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return response.data.candidates?.[0]?.content.parts[0]?.text || "No response generated.";
}

// Route to generate essay
app.post("/generate-essay", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const prompt = `Write a detailed essay on the topic: "${title}". Include an introduction, body, and conclusion.`;
        const essay = await getGeminiResponse(prompt);

        res.json({ essay });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate essay" });
    }
});

// Route to optimize essay
app.post("/optimize-essay", async (req, res) => {
    try {
        const { essay } = req.body;
        if (!essay) return res.status(400).json({ error: "Essay text is required" });

        const prompt = `Optimize the following essay for better clarity and readability:\n\n${essay}`;
        const optimizedEssay = await getGeminiResponse(prompt);

        res.json({ optimizedEssay });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to optimize essay" });
    }
});
