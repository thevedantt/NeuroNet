
import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini/client";
import { db } from "@/config/db";
import { aiChatSessions, aiChatMessages } from "@/config/schema";
import { eq, asc } from "drizzle-orm";
import { SUMMARIZATION_PROMPT } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
    try {
        const { sessionId, language } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        // Fetch messages for the session to summarize
        const messages = await db.select().from(aiChatMessages)
            .where(eq(aiChatMessages.sessionId, sessionId))
            .orderBy(asc(aiChatMessages.createdAt));

        if (messages.length === 0) {
            return NextResponse.json({ error: "No messages found for this session" }, { status: 404 });
        }

        const chatLog = messages.map(m => `${m.sender.toUpperCase()}: ${m.messageText}`).join("\n");

        const prompt = `
${SUMMARIZATION_PROMPT}

SESSION LANGUAGE: ${language || 'en'}

CHAT LOG:
${chatLog}

GENERATE SUMMARY:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summaryText = response.text();

        // Log to console (Required format)
        console.log(`[AI CHAT SUMMARY]
Session ID: ${sessionId}
Language: ${language || 'en'}
Summary:
${summaryText}`);

        // Save to DB
        await db.update(aiChatSessions)
            .set({ summary: summaryText })
            .where(eq(aiChatSessions.sessionId, sessionId));

        return NextResponse.json({ summary: summaryText });

    } catch (error: any) {
        console.error("Summarization failed:", error);

        const status = error.message.includes("429") ? 429 : 500;
        return NextResponse.json(
            { error: "Failed to generate summary", details: error instanceof Error ? error.message : String(error) },
            { status }
        );
    }
}
