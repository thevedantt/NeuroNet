
import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY; // Fallback to GEMINI_KEY if user reuses it, though OpenRouter key is preferred format
const isGoogleKey = apiKey?.startsWith("AIza"); // Simple check, usually OpenRouter keys start differently

// If it's a Google Key, we can't use OpenRouter easily without valid OpenRouter key. 
// Assuming user WILL provide OPENROUTER_API_KEY in env.
// For now, logging warning if missing.

if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY is not defined. Using GEMINI_API_KEY as fallback (might fail if not valid for OpenRouter).");
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://neuronet.app",
        "X-Title": "NeuroNet",
    },
});

// Adapter to match GoogleGenerativeAI interface
export const model = {
    startChat: (config: { history?: { role: string; parts: { text: string }[] }[] }) => {
        // Maintain local history state for this chat session wrapper
        let sessionHistory = config.history ? config.history.map(msg => ({
            role: msg.role === "model" ? "assistant" : "user",
            content: msg.parts[0].text
        })) : [];

        return {
            sendMessage: async (message: string) => {
                // Add user message to history
                sessionHistory.push({ role: "user", content: message });
                console.log(sessionHistory);

                try {
                    const completion = await openai.chat.completions.create({
                        model: "google/gemma-3-12b-it", // Free tier model on OpenRouter, nice fallback
                        messages: sessionHistory as any,
                    });

                    const responseText = completion.choices[0]?.message?.content || "";

                    // Add assistant response to history
                    sessionHistory.push({ role: "assistant", content: responseText });

                    return {
                        response: {
                            text: () => responseText
                        }
                    };
                } catch (error: any) {
                    console.error("OpenRouter API Error:", error);
                    // Throw generic error or specific one mimicking Gemini?
                    // Existing code catches errors.
                    throw new Error(`OpenRouter Error: ${error.message}`);
                }
            }
        };
    },

    generateContent: async (prompt: string) => {
        try {
            const completion = await openai.chat.completions.create({
                model: "google/gemma-3-12b-it",
                messages: [{ role: "user", content: prompt }],
            });

            const responseText = completion.choices[0]?.message?.content || "";
            return {
                response: {
                    text: () => responseText
                }
            };
        } catch (error: any) {
            console.error("OpenRouter Generate Error:", error);
            throw new Error(`OpenRouter Error: ${error.message}`);
        }
    }
};


// Legacy export to satisfy existing imports if any (though route.ts uses `model`)
export const genAI = {
    getGenerativeModel: () => model
};
