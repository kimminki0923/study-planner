import { GoogleGenerativeAI } from "@google/generative-ai";

const SAFETY_SETTINGS = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
    },
];

export const analyzeStudyData = async (sessions, subjects, userGoals, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare data summary for the prompt
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Filter sessions for the last 2 weeks to give context
        const relevantSessions = Object.values(sessions || {}).filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= oneWeekAgo; // Keep it simple for now, last 7 days + history if needed
        });

        const subjectMap = subjects.reduce((acc, sub) => {
            acc[sub.id] = sub.name;
            return acc;
        }, {});

        const prompt = `
      You are a strict but encouraging study coach for a Korean high school student preparing for the Suneung (CSAT).
      
      **Student Profile:**
      - Name: ${userGoals.name}
      - Target Date: ${userGoals.targetDate}
      - Goal: ${userGoals.goalDescription}
      
      **Study Data (Last 7 Days):**
      ${JSON.stringify(relevantSessions.map(s => ({
            date: new Date(s.startTime).toLocaleDateString(),
            subject: subjectMap[s.subjectId] || s.subjectId,
            durationMinutes: Math.round(s.totalTime / 60)
        })), null, 2)}
      
      **Request:**
      1. Analyze the study patterns. Is the student studying enough? compare with standard Suneung perception.
      2. Identify weak subjects (subjects with low or no study time) patterns.
      3. Suggest a specific, actionable plan for the next week.
      4. Give a short, motivating quote or advice in a friendly "Hyung/Unnie" (older brother/sister) tone.
      
      Please respond in Korean, using Markdown for formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};
