import { GoogleGenAI } from "@google/genai";

export const analyzeStudyData = async (sessions, subjects, userGoals, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

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

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // Updated as per user's screenshot request
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        // Handle different response structures from the new SDK
        if (response && response.text) {
            return response.text();
        } else if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0].text) {
            return response.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response format from Gemini API");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};
