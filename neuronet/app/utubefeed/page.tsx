"use client";

import { YoutubeFeed } from "@/components/dashboard/YoutubeFeed";

export default function YoutubeFeedPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Personal Feed</h1>
            <p className="text-muted-foreground">
                Curated content to help you relax, laugh, and stay inspired.
            </p>
            <div className="w-full">
                <YoutubeFeed />
            </div>
        </div>
    );
}
