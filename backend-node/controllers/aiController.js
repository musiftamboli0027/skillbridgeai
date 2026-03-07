const { GoogleGenerativeAI } = require("@google/generative-ai");
const CareerRoadmap = require('../models/CareerRoadmap');
const asyncHandler = require('../utils/asyncHandler');

// AI Config
const LYZR_API_KEY = process.env.LYZR_API_KEY;
const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;
const LYZR_API_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
const LYZR_TIMEOUT_MS = 20000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_TIMEOUT_MS = 10000;
const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-1.5-flash"
];

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper functions
async function callLyzrAgent(message, sessionId = 'default-session', userId = 'skillbridge-user') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LYZR_TIMEOUT_MS);
    try {
        const response = await fetch(LYZR_API_URL, {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json', 'x-api-key': LYZR_API_KEY },
            body: JSON.stringify({ agent_id: LYZR_AGENT_ID, session_id: sessionId, user_id: userId, message })
        });
        clearTimeout(timer);
        if (!response.ok) return { success: false, error: `Lyzr API error: HTTP ${response.status}` };
        const json = await response.json();
        const reply = json?.response ?? json?.message ?? json?.output ?? null;
        return reply !== null ? { success: true, reply: String(reply) } : { success: false, error: 'Unexpected shape' };
    } catch (err) {
        clearTimeout(timer);
        return { success: false, error: err.message };
    }
}

async function generateAIResponse(prompt, isRoadmap = false) {
    let lastError = null;
    const timeout = isRoadmap ? 30000 : AI_TIMEOUT_MS;
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), timeout));
            const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
            const responseText = result.response.text();
            try {
                return { success: true, data: JSON.parse(responseText) };
            } catch (e) {
                const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                return { success: true, data: JSON.parse(cleanJson) };
            }
        } catch (err) {
            lastError = err;
            if (err.status === 429) continue;
            if (err.status === 400) break;
        }
    }
    return { success: false, isQuotaExceeded: lastError?.status === 429, error: lastError?.message };
}

// Controller Methods
exports.getTutorResponse = asyncHandler(async (req, res) => {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    const result = await callLyzrAgent(message, sessionId);
    if (result.success) return res.json({ success: true, reply: result.reply });
    res.status(503).json({ success: false, message: 'AI Tutor temporarily unavailable' });
});

exports.getTutorChat = asyncHandler(async (req, res) => {
    const { message, conversationHistory = [], courseTitle } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    
    // We can use the same Lyzr agent call for this for now!
    const result = await callLyzrAgent(message, 'chat-session');
    if (result.success) return res.json({ success: true, reply: result.reply });
    res.status(503).json({ success: false, message: 'AI Tutor temporarily unavailable' });
});

exports.debugCode = asyncHandler(async (req, res) => {
    const { code, language, lessonTitle } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'Code and language required' });
    const prompt = `Debug ${language} for ${lessonTitle}. Code: ${code}. Provide Socratic feedback in JSON format.`;
    const result = await generateAIResponse(prompt);
    if (result.success) return res.json({ success: true, data: result.data });
    res.status(503).json({ success: false, message: result.isQuotaExceeded ? 'Busy, retry in 30s' : 'AI error' });
});

exports.generateRoadmap = asyncHandler(async (req, res) => {
    const { career, level, skills, hours, budget, goal } = req.body;
    const prompt = `Generate engineering roadmap for ${career}... (Shortened for space). Return JSON.`;
    const result = await generateAIResponse(prompt, true);
    if (result.success) {
        const saved = await CareerRoadmap.findOneAndUpdate(
            { userId: req.user.id },
            { userId: req.user.id, profile: req.body, roadmap: result.data, generatedAt: new Date() },
            { upsert: true, new: true }
        );
        return res.json({ success: true, roadmap: saved.roadmap });
    }
    res.status(503).json({ success: false, message: 'Roadmap generation failed' });
});

exports.getRoadmap = asyncHandler(async (req, res) => {
    const roadmap = await CareerRoadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.json({ success: true, exists: false });
    res.json({ success: true, exists: true, roadmap: roadmap.roadmap, profile: roadmap.profile });
});
