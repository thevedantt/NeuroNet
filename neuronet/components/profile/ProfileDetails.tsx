"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Brain,
    HeartPulse,
    Moon,
    Users,
    Gauge,
    MessageSquare,
    Music,
    Mic2,
    Tv,
    Clapperboard,
    Smile,
    Paintbrush,
    Youtube,
    Instagram,
    Twitter,
} from "lucide-react";

// Reddit icon (lucide doesn't have one, using a custom SVG inline)
function RedditIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.8 11.33c.02.16.03.33.03.5 0 2.55-2.97 4.62-6.63 4.62s-6.63-2.07-6.63-4.62c0-.17.01-.33.03-.5a1.48 1.48 0 01-.6-1.2c0-.82.67-1.49 1.49-1.49.4 0 .76.16 1.03.41 1.01-.7 2.4-1.15 3.94-1.21l.67-3.13a.3.3 0 01.36-.24l2.2.47a1.05 1.05 0 011.97.36c0 .58-.47 1.05-1.05 1.05s-1.05-.47-1.05-1.05l-1.97-.42-.6 2.81c1.5.07 2.87.52 3.86 1.21.27-.25.63-.41 1.03-.41.82 0 1.49.67 1.49 1.49 0 .49-.24.92-.6 1.2zM9.5 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm5 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-4.75 3.13c-.13-.13-.13-.33 0-.46s.33-.13.46 0c.63.63 1.54.94 2.79.94s2.16-.31 2.79-.94c.13-.13.33-.13.46 0s.13.33 0 .46c-.75.75-1.81 1.12-3.25 1.12s-2.5-.37-3.25-1.12z" />
        </svg>
    );
}

interface ProfileData {
    gender?: string;
    preferredLanguage?: string;
    primaryConcern?: string;
    therapyPreference?: string;
    previousExperience?: string;
    sleepPattern?: string;
    supportSystem?: string;
    stressLevel?: string;
    socialPlatforms?: string[];
    socialPreferences?: Record<string, string>;
    hobbies?: string[];
    musicDetails?: { genre?: string; artist?: string } | null;
    entertainment?: {
        bingeType?: string;
        bingeList?: string[];
        comfortArtist?: string;
        favoriteComedian?: string;
    } | null;
}

interface ProfileDetailsProps {
    data: ProfileData;
    userEmail?: string;
}

const PLATFORM_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    youtube: { label: "YouTube", icon: Youtube, color: "bg-red-500/10 text-red-600 border-red-500/20" },
    instagram: { label: "Instagram", icon: Instagram, color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
    twitter: { label: "Twitter (X)", icon: Twitter, color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
    reddit: { label: "Reddit", icon: RedditIcon, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-foreground mt-0.5">{value || "Not set"}</span>
            </div>
        </div>
    );
}

function StressIndicator({ level }: { level?: string }) {
    const colors: Record<string, string> = {
        Low: "bg-emerald-500",
        Medium: "bg-amber-500",
        High: "bg-red-500",
    };

    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
                <Gauge className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stress Level
                </span>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[level || ""] || "bg-muted"}`} />
                    <span className="text-sm font-semibold text-foreground">{level || "Not set"}</span>
                </div>
            </div>
        </div>
    );
}

export function ProfileDetails({ data, userEmail }: ProfileDetailsProps) {
    const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "NN";
    const hasSocialPlatforms = data.socialPlatforms && data.socialPlatforms.length > 0;
    const hasHobbies = data.hobbies && data.hobbies.length > 0;
    const hasMusic = data.musicDetails && (data.musicDetails.genre || data.musicDetails.artist);
    const hasEntertainment = data.entertainment && data.entertainment.bingeType && data.entertainment.bingeType !== "None";
    const hasComfortContent = data.entertainment && (data.entertainment.comfortArtist || data.entertainment.favoriteComedian);

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <InfoRow icon={User} label="Gender" value={data.gender} />
                        <InfoRow icon={Brain} label="Primary Concern" value={data.primaryConcern} />
                        <InfoRow icon={MessageSquare} label="Therapy Preference" value={data.therapyPreference} />
                        <InfoRow icon={HeartPulse} label="Previous Experience" value={data.previousExperience} />
                        <InfoRow icon={Moon} label="Sleep Pattern" value={data.sleepPattern} />
                        <InfoRow icon={Users} label="Support System" value={data.supportSystem} />
                        <StressIndicator level={data.stressLevel} />
                    </div>
                </CardContent>
            </Card>

            {/* Interests & Lifestyle */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Paintbrush className="h-5 w-5 text-primary" />
                        Interests & Lifestyle
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Hobbies */}
                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Hobbies
                        </h4>
                        {hasHobbies ? (
                            <div className="flex flex-wrap gap-2">
                                {data.hobbies!.map((hobby) => (
                                    <Badge
                                        key={hobby}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm font-medium rounded-full bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
                                    >
                                        {hobby}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No hobbies added yet</p>
                        )}
                    </div>

                    {/* Music Preferences */}
                    {hasMusic && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                    Music Preferences
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {data.musicDetails?.genre && (
                                        <InfoRow icon={Music} label="Favorite Genre" value={data.musicDetails.genre} />
                                    )}
                                    {data.musicDetails?.artist && (
                                        <InfoRow icon={Mic2} label="Favorite Artist" value={data.musicDetails.artist} />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Entertainment */}
                    {(hasEntertainment || hasComfortContent) && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                    Entertainment & Relaxation
                                </h4>

                                {hasEntertainment && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clapperboard className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground">
                                                Favorite Category: {data.entertainment!.bingeType}
                                            </span>
                                        </div>
                                        {data.entertainment!.bingeList && data.entertainment!.bingeList.filter(Boolean).length > 0 && (
                                            <div className="flex flex-wrap gap-2 ml-6">
                                                {data.entertainment!.bingeList.filter(Boolean).map((item, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="px-3 py-1.5 text-sm rounded-full"
                                                    >
                                                        <Tv className="h-3 w-3 mr-1.5" />
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {data.entertainment?.comfortArtist && (
                                        <InfoRow icon={Music} label="Comfort Artist" value={data.entertainment.comfortArtist} />
                                    )}
                                    {data.entertainment?.favoriteComedian && (
                                        <InfoRow icon={Smile} label="Favorite Comedian" value={data.entertainment.favoriteComedian} />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        Social Media
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSocialPlatforms ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(PLATFORM_CONFIG).map(([id, config]) => {
                                    const isActive = data.socialPlatforms!.includes(id);
                                    const PlatformIcon = config.icon;
                                    return (
                                        <div
                                            key={id}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                                                isActive
                                                    ? `${config.color} border-current/20 shadow-sm`
                                                    : "bg-muted/30 text-muted-foreground border-transparent opacity-40"
                                            }`}
                                        >
                                            <PlatformIcon className="h-5 w-5 shrink-0" />
                                            <span className="text-sm font-semibold truncate">
                                                {config.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Social preferences detail */}
                            {data.socialPreferences && Object.keys(data.socialPreferences).length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <Separator />
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        What you enjoy
                                    </h4>
                                    {data.socialPlatforms!.map((platformId) => {
                                        const pref = data.socialPreferences?.[platformId];
                                        const config = PLATFORM_CONFIG[platformId];
                                        if (!pref || !config) return null;
                                        const PlatformIcon = config.icon;
                                        return (
                                            <div key={platformId} className="flex items-start gap-3 py-1">
                                                <PlatformIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {config.label}
                                                    </span>
                                                    <p className="text-sm text-foreground mt-0.5">{pref}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No social platforms added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
