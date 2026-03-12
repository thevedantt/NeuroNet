"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { toast } from "sonner";
import { Globe, Pencil, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface UserInfo {
    id: string;
    email: string;
    role: string;
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

function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-10 max-w-3xl space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Cards skeleton */}
            {[1, 2, 3].map((i) => (
                <Card key={i} className="border shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <Card className="border shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Profile Data Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        You haven&apos;t filled in your profile information yet. Complete your profile to get personalized recommendations.
                    </p>
                    <Link href="/editprofile">
                        <Button>
                            <Pencil className="h-4 w-4 mr-2" />
                            Complete Your Profile
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user info
                const token = localStorage.getItem("token");
                if (token) {
                    const meRes = await fetch("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        setUserInfo(meData);
                    }
                }

                // Fetch profile data
                const profileRes = await fetch("/api/profile");

                if (profileRes.status === 401) {
                    toast.error("Session expired", {
                        description: "Please log in again.",
                    });
                    router.push("/auth/login");
                    return;
                }

                if (!profileRes.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await profileRes.json();

                // Check if profile has actual data
                if (data && Object.keys(data).length > 0) {
                    // Filter out meta fields
                    const { id, userId, createdAt, updatedAt, inputMetadata, ...cleanData } = data;
                    setProfileData(cleanData);
                } else {
                    setProfileData(null);
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError(true);
                toast.error("Error loading profile", {
                    description: "Could not load your profile data.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 max-w-3xl">
                <Card className="border shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            We couldn&apos;t load your profile. Please try again.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!profileData || Object.keys(profileData).filter(k => profileData[k as keyof ProfileData]).length === 0) {
        return <EmptyState />;
    }

    const initials = userInfo?.email
        ? userInfo.email.substring(0, 2).toUpperCase()
        : "NN";

    return (
        <div className="container mx-auto py-10 max-w-3xl animate-in fade-in-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">
                            {userInfo?.email?.split("@")[0] || "User"}
                        </h1>
                        {userInfo?.email && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {userInfo.email}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {profileData.preferredLanguage && (
                                <Badge variant="outline" className="text-xs px-2.5 py-0.5 rounded-full">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {profileData.preferredLanguage}
                                </Badge>
                            )}
                            {profileData.primaryConcern && (
                                <Badge variant="secondary" className="text-xs px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                                    {profileData.primaryConcern}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/editprofile">
                        <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Profile Details */}
            <ProfileDetails data={profileData} userEmail={userInfo?.email} />

            {/* Logout Section */}
            <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Account</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Sign out of your account
                        </p>
                    </div>
                    <LogoutButton variant="destructive" size="sm" />
                </div>
            </div>
        </div>
    );
}
