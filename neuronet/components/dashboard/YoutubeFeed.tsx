"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Music, Smile, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

interface VideoCategories {
    comedy: Video[];
    music: Video[];
    spiritual: Video[];
}

export function YoutubeFeed() {
    const { language } = useLanguage();
    const [categories, setCategories] = useState<VideoCategories | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playingId, setPlayingId] = useState<string | null>(null);

    const labels = {
        en: {
            comedyTitle: "Comedy for You",
            musicTitle: "Your Comfort Music",
            spiritualTitle: "Calm & Spiritual",
            subtitle: "Curated based on your profile"
        },
        hi: {
            comedyTitle: "आपके लिए कॉमेडी",
            musicTitle: "आपका सुकून भरा संगीत",
            spiritualTitle: "शांति और अध्यात्म",
            subtitle: "आपकी पसंद के आधार पर चुना गया"
        }
    };

    const t = labels[language as 'en' | 'hi'] || labels.en;

    useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await fetch("/api/youtube/feed");
                const data = await res.json();

                if (res.status === 401) {
                    setError("Session expired. Please log in again to view recommendations.");
                    return;
                }

                if (!res.ok) {
                    throw new Error(data.error || `Error ${res.status}: Failed to load content`);
                }

                if (data.error) {
                    setError(data.error);
                    return;
                }

                setCategories(data.categories);

                // Auto-play logic: Set the first comedy video as playing by default
                if (data.categories?.comedy?.length > 0) {
                    setPlayingId(data.categories.comedy[0].id);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Could not load your personalized recommendations.");
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, []);

    const VideoCard = ({ video, autoPlay = false, sectionIcon: Icon }: { video: Video, autoPlay?: boolean, sectionIcon: any }) => {
        const isPlaying = playingId === video.id;

        return (
            <div className="flex flex-col space-y-3">
                <div
                    className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg ring-1 ring-white/10"
                    // If not playing, allow click to play
                    onClick={() => !isPlaying && setPlayingId(video.id)}
                >
                    {isPlaying ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="group relative w-full h-full cursor-pointer">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out" />
                                <PlayCircle className="h-14 w-14 text-white drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-active:scale-95" />
                            </div>

                            {/* Duration or Labels could go here */}
                        </div>
                    )}
                </div>

                <div className="space-y-1 px-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={`font-semibold text-sm leading-snug line-clamp-2 ${isPlaying ? 'text-primary' : 'text-foreground'}`}
                            title={video.title}
                        >
                            {video.title}
                        </h3>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {video.channelTitle}
                    </p>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!categories) return null;

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                            {t.subtitle}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                            A mix of laughs, comfort, and peace tailored just for you.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* 1. Comedy Primary (Auto-plays) */}
                    {categories.comedy[0] && (
                        <div className="lg:col-span-1">
                            <div className="mb-3 flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider">
                                <Smile className="h-4 w-4" /> {t.comedyTitle}
                            </div>
                            <VideoCard
                                video={categories.comedy[0]}
                                autoPlay={true}
                                sectionIcon={Smile}
                            />
                        </div>
                    )}

                    {/* 2. Comedy Secondary */}
                    {categories.comedy[1] && (
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            {/* Spacer or label to align visually if needed, but secondary comedy needs label too for clarity? Or group them? 
                                 The prompt says "Video Card 1" "Video Card 2". 
                                 Let's keep the label consistent above the first one, or add one here too.
                                 Let's treat columns as distinct cards.
                             */}
                            <div className="mb-3 flex items-center gap-2 text-muted-foreground font-medium text-sm uppercase tracking-wider opacity-0 lg:opacity-100">
                                {/* Hidden label for alignment on desktop, visible on mobile? No, just empty space or align top */}
                                &nbsp;
                            </div>
                            <VideoCard video={categories.comedy[1]} sectionIcon={Smile} />
                        </div>
                    )}

                    {/* 3. Music */}
                    {categories.music[0] && (
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="mb-3 flex items-center gap-2 text-blue-500 font-medium text-sm uppercase tracking-wider">
                                <Music className="h-4 w-4" /> {t.musicTitle}
                            </div>
                            <VideoCard video={categories.music[0]} sectionIcon={Music} />
                        </div>
                    )}

                    {/* 4. Spiritual */}
                    {categories.spiritual[0] && (
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="mb-3 flex items-center gap-2 text-indigo-500 font-medium text-sm uppercase tracking-wider">
                                <Sparkles className="h-4 w-4" /> {t.spiritualTitle}
                            </div>
                            <VideoCard video={categories.spiritual[0]} sectionIcon={Sparkles} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
