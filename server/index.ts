import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables (from .env or .env.local)
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app = express();
const port = process.env.PORT || 3002;

// 1. Security Headers
app.use(helmet());

// 2. CORS Security (Limit origins)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

// 3. Rate Limiting (Prevent DDoS / API Abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { error: "Too many requests, please try again later." }
});
app.use('/api/', apiLimiter);

// 4. Payload size limit to prevent oversized request attacks
app.use(express.json({ limit: '1mb' }));

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

app.post('/api/search', async (req, res) => {
  try {
    const { query, categoryId, filters } = req.body;

    // 5. Input Validation / Sanitization
    if (query && (typeof query !== 'string' || query.length > 200)) {
      return res.status(400).json({ error: "Invalid search query. Maximum 200 characters allowed." });
    }
    if (categoryId && (typeof categoryId !== 'string' || categoryId.length > 50)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    // Construct a prompt to generate mock lawyers based on search
    const prompt = `
      You are a legal directory API. Generate a JSON list of 3-5 highly realistic fictional lawyers or law firms that match the following criteria:
      - Search Query: ${query || 'None'}
      - Practice Area / Category: ${categoryId || 'Any'}
      - Filters: ${JSON.stringify(filters || {})}
      
      For each professional, provide the following fields:
      - id: unique string
      - name: string (lawyer name or firm name)
      - type: "individual" or "firm"
      - practiceAreas: array of strings
      - location: string (city, state)
      - experience: string (e.g., "10+ years")
      - priceRange: string (e.g., "$200-500/hr")
      - language: array of strings (e.g., ["English", "Spanish"])
      - rating: number (1.0 to 5.0)
      - reviewCount: number
      - description: string (brief bio, max 2 sentences)
      
      Return ONLY valid JSON containing an array of objects.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "[]";
    const lawyers = JSON.parse(text);

    res.json({ lawyers });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch experts" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
