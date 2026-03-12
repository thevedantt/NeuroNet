
import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { userProfiles } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';
import { model } from '@/lib/gemini/client';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const FALLBACK_VIDEOS = {
    comedy: [
        {
            id: "L_2q-C-gMKQ",
            title: "Tough Hai | Zakir Khan | Standup Comedy",
            thumbnail: "https://i.ytimg.com/vi/L_2q-C-gMKQ/hqdefault.jpg",
            channelTitle: "Zakir Khan"
        },
        {
            id: "4q9UafsiQ6k",
            title: "Middle Class Restaurant | Kenny Sebastian | Standup Comedy",
            thumbnail: "https://i.ytimg.com/vi/4q9UafsiQ6k/hqdefault.jpg",
            channelTitle: "Kenny Sebastian"
        }
    ],
    music: [
        {
            id: "jfKfPfyJRdk",
            title: "lofi hip hop radio - beats to relax/study to",
            thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
            channelTitle: "Lofi Girl"
        }
    ],
    spiritual: [
        {
            id: "hDm9rX6f1Q",
            title: "Great Meditation | 10 Minute Guided Meditation",
            thumbnail: "https://i.ytimg.com/vi/hDm9rX6f1Q/hqdefault.jpg",
            channelTitle: "Great Meditation"
        }
    ],
    crisis: [
        {
            id: "1Evwgu369Jw",
            title: "Finding Hope in Dark Times",
            thumbnail: "https://i.ytimg.com/vi/1Evwgu369Jw/hqdefault.jpg",
            channelTitle: "Douglas Bloch"
        },
        {
            id: "lG7l84hZkSs",
            title: "You Are Not Alone - Crisis Support",
            thumbnail: "https://i.ytimg.com/vi/lG7l84hZkSs/hqdefault.jpg",
            channelTitle: "Psych2Go"
        }
    ]
};

// Helper to get authenticated user ID
async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        console.log("[YouTube Feed API] Auth failed: No token found in cookies.");
        return null; // No token
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
        console.log("[YouTube Feed API] Auth failed: Token verification failed.");
        return null;
    }

    return payload.sub as string;
}

// Helper to fetch from YouTube
async function fetchFromYouTube(query: string, maxResults: number) {
    if (!YOUTUBE_API_KEY) return [];

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            console.error("YouTube API Error for query:", query, data);
            return [];
        }

        if (!data.items) return [];

        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle
        }));
    } catch (error) {
        console.error("YouTube Fetch Error:", error);
        return [];
    }
}

export async function GET(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User Profile
        const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
        const profile = profiles[0];

        // LOGGING FOR DEBUGGING
        console.log("[YouTube Feed] Fetched Profile:", profile ? "Found" : "Not Found");
        if (profile) {
            console.log("[YouTube Feed] Profile Data:", JSON.stringify(profile, null, 2));
        }

        // Generate Personalized Queries via AI
        let comedyQuery = "standup comedy";
        let musicQuery = "relaxing music";
        let wellbeingQuery = "stress relief meditation";

        if (profile) {
            try {
                // Construct a prompt for the AI
                const prompt = `
                You are a helpful assistant for a mental wellness app.
                Based on the following user profile data, generate 3 specific YouTube search queries that would be most beneficial and enjoyable for this user.
                
                Profile: ${JSON.stringify(profile)}
                
                Categories needed:
                1. Entertainment/Comedy (based on favorites, hobbies, social preferences like 'entertainment' or 'socialPreferences')
                2. Music/Comfort (based on music details, comfort artist, mood)
                3. Wellness/Support (based on primary concern, stress level, spirituality). 
                   *CRITICAL*: If the profile mentions "suicide" or severe distress, ensure the Wellness query finds supportive, hopeful, or crisis-resource content (e.g., "finding hope", "crisis support", "overcoming darkness") - do not return empty or refuse. The goal is to show helpful videos.

                Output format: Return ONLY the 3 queries separated by a pipe symbol (|). Example: "Zakira Khan comedy|Prateek Kuhad songs|Anxiety relief meditation". Do not add labels.
                `;

                console.log("[YouTube Feed] Generating AI queries...");
                const aiResult = await model.generateContent(prompt);
                const responseText = aiResult.response.text().trim();
                console.log("[YouTube Feed] AI Response:", responseText);

                const parts = responseText.split('|');
                if (parts.length >= 3) {
                    comedyQuery = parts[0].trim();
                    musicQuery = parts[1].trim();
                    wellbeingQuery = parts[2].trim();
                } else {
                    console.warn("[YouTube Feed] AI response format mismatch. Using fallbacks.");
                }

            } catch (aiError) {
                console.error("[YouTube Feed] AI Generation Error:", aiError);

                const entertainment = profile.entertainment as Record<string, any> | null;
                const music = profile.musicDetails as Record<string, any> | null;

                if (entertainment?.favoriteComedian) comedyQuery = `${entertainment.favoriteComedian} standup`;
                if (entertainment?.comfortArtist) musicQuery = `${entertainment.comfortArtist} songs`;
                else if (music?.artist) musicQuery = `${music.artist} songs`;

                if (profile.primaryConcern) wellbeingQuery = `${profile.primaryConcern} help`;
            }
        }

        console.log(`[YouTube API] Final Queries - Comedy: "${comedyQuery}", Music: "${musicQuery}", Wellness: "${wellbeingQuery}"`);

        // Check for API Key
        let comedyVideos: any[] = [];
        let musicVideos: any[] = [];
        let wellnessVideos: any[] = [];

        if (!YOUTUBE_API_KEY) {
            console.warn("Missing YOUTUBE_API_KEY. Serving fallback content.");
            comedyVideos = FALLBACK_VIDEOS.comedy;
            musicVideos = FALLBACK_VIDEOS.music;
            wellnessVideos = FALLBACK_VIDEOS.spiritual;
        } else {
            // Fetch real data in parallel
            [comedyVideos, musicVideos, wellnessVideos] = await Promise.all([
                fetchFromYouTube(comedyQuery, 2),
                fetchFromYouTube(musicQuery, 1),
                fetchFromYouTube(wellbeingQuery, 1)
            ]);

            // Fallback if individual topics return no results (e.g. quota limit)
            if (comedyVideos.length === 0) comedyVideos = FALLBACK_VIDEOS.comedy;
            if (musicVideos.length === 0) musicVideos = FALLBACK_VIDEOS.music;

            if (wellnessVideos.length === 0) {
                // Smart Fallback: Check if the AI generated a crisis-related query
                // even though the API key failed, we know the INTENT from the query.
                const isCrisis = /crisis|suicide|hope|darkness|support/i.test(wellbeingQuery);
                if (isCrisis) {
                    console.log("[YouTube Feed] Quota limit hit, but CRISIS detected. Serving specific crisis fallbacks.");
                    wellnessVideos = FALLBACK_VIDEOS.crisis;
                } else {
                    wellnessVideos = FALLBACK_VIDEOS.spiritual;
                }
            }
        }

        return NextResponse.json({
            categories: {
                comedy: comedyVideos,
                music: musicVideos,
                spiritual: wellnessVideos // Map to spiritual for frontend compatibility
            }
        });
    } catch (error) {
        console.error('YouTube Feed Error:', error);
        return NextResponse.json({
            categories: FALLBACK_VIDEOS
        });
    }
}
