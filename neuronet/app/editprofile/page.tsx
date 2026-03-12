"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { InterviewField } from "@/components/profile/InterviewField";
import { useLanguage } from "@/context/LanguageContext";
import { EditProfileOverlay } from "@/components/onboarding/EditProfileOverlay";

const DROPDOWN_OPTIONS = {
    gender: [
        { value: "Male", labels: { en: "Male", hi: "पुरुष", mr: "पुरुष" } },
        { value: "Female", labels: { en: "Female", hi: "महिला", mr: "महिला" } },
        { value: "Prefer not to say", labels: { en: "Prefer not to say", hi: "कहना पसंद नहीं", mr: "सांगणे पसंत नाही" } }
    ],
    preferredLanguage: [
        { value: "English", labels: { en: "English", hi: "अंग्रेजी", mr: "इंग्रजी" } },
        { value: "Hindi", labels: { en: "Hindi", hi: "हिंदी", mr: "हिंदी" } },
        { value: "Both", labels: { en: "Both", hi: "दोनों", mr: "दोन्ही" } }
    ],
    primaryConcern: [
        { value: "Anxiety & Stress", labels: { en: "Anxiety & Stress", hi: "चिंता और तनाव", mr: "चिंता आणि तणाव" } },
        { value: "Low Mood", labels: { en: "Low Mood", hi: "उदास मन", mr: "उदासीनता" } },
        { value: "Career Direction", labels: { en: "Career Direction", hi: "करियर दिशा", mr: "करिअर दिशा" } }
    ],
    therapyPreference: [
        { value: "Chat", labels: { en: "Chat", hi: "चैट", mr: "चॅट" } },
        { value: "Video", labels: { en: "Video", hi: "वीडियो", mr: "व्हिडिओ" } },
        { value: "Both", labels: { en: "Both", hi: "दोनों", mr: "दोन्ही" } }
    ],
    previousExperience: [
        { value: "Yes", labels: { en: "Yes", hi: "हाँ", mr: "हो" } },
        { value: "No", labels: { en: "No", hi: "नहीं", mr: "नाही" } },
        { value: "Not sure", labels: { en: "Not sure", hi: "पता नहीं", mr: "खात्री नाही" } }
    ],
    sleepPattern: [
        { value: "Good", labels: { en: "Good", hi: "अच्छा", mr: "चांगले" } },
        { value: "Average", labels: { en: "Average", hi: "औसत", mr: "सरासरी" } },
        { value: "Poor", labels: { en: "Poor", hi: "खराब", mr: "खराब" } }
    ],
    supportSystem: [
        { value: "Friends/Family", labels: { en: "Friends/Family", hi: "मित्र/परिवार", mr: "मित्र/कुटुंब" } },
        { value: "Limited", labels: { en: "Limited", hi: "सीमित", mr: "मर्यादित" } },
        { value: "None", labels: { en: "None", hi: "कोई नहीं", mr: "कोणीही नाही" } }
    ],
    stressLevel: [
        { value: "Low", labels: { en: "Low", hi: "कम", mr: "कमी" } },
        { value: "Medium", labels: { en: "Medium", hi: "मध्यम", mr: "मध्यम" } },
        { value: "High", labels: { en: "High", hi: "उच्च", mr: "उच्च" } }
    ]
};

const SOCIAL_PLATFORMS = [
    {
        id: "youtube",
        label: "YouTube",
        question: "What do you like to watch on YouTube?",
        prompts: {
            en: "What kind of videos do you usually watch on YouTube? Podcasts, Vlogs, or something else?",
            hi: "आप YouTube पर आमतौर पर किस तरह के वीडियो देखते हैं? पॉडकास्ट, व्लॉग, या कुछ और?",
            mr: "तुम्ही YouTube वर साधारणपणे कोणत्या प्रकारचे व्हिडिओ पाहता? पॉडकास्ट, व्लॉग्स की आणखी काही?"
        }
    },
    {
        id: "instagram",
        label: "Instagram",
        question: "What content do you enjoy on Instagram?",
        prompts: {
            en: "What type of content do you engage with on Instagram? Reels, Memes, or Stories?",
            hi: "आप Instagram पर किस तरह की सामग्री पसंद करते हैं? रील्स, मीम्स या स्टोरीज?",
            mr: "तुम्ही Instagram वर कोणत्या प्रकारची सामग्री पाहणे पसंत करता? रील्स, मीम्स की स्टोरीज?"
        }
    },
    {
        id: "twitter",
        label: "Twitter (X)",
        question: "What do you follow on Twitter?",
        prompts: {
            en: "What topics do you follow on Twitter? Tech, Politics, or News?",
            hi: "आप Twitter पर किन विषयों को फॉलो करते हैं? तकनीक, राजनीति या समाचार?",
            mr: "तुम्ही Twitter वर कोणत्या विषयांचे अनुसरण करता? तंत्रज्ञान, राजकारण की बातम्या?"
        }
    },
    {
        id: "reddit",
        label: "Reddit",
        question: "Which topics do you follow on Reddit?",
        prompts: {
            en: "Which communities or subreddits are you active in?",
            hi: "आप किन कम्युनिटीज़ या सबरेडिट्स में सक्रिय हैं?",
            mr: "तुम्ही कोणत्या कम्युनिटीज किंवा सबरेडिट्समध्ये सक्रिय आहात?"
        }
    },
];

const HOBBIES = ["Watching videos", "Listening to music", "Drawing", "Exploring / traveling", "Reading", "Gaming"];
const MUSIC_GENRES = ["Pop", "Rock", "Indie", "Classical", "Hip Hop", "Jazz", "Electronic", "Bollywood", "K-Pop", "Other"];
const BINGE_TYPES = ["Movies", "Series", "Anime", "Comics/Manga", "None"];

const DEFAULT_PROFILE = {
    gender: "Prefer not to say",
    preferredLanguage: "English",
    primaryConcern: "Anxiety & Stress",
    therapyPreference: "Video",
    previousExperience: "No",
    sleepPattern: "Average",
    supportSystem: "Friends/Family",
    stressLevel: "Medium"
};

export default function ProfilePage() {
    const { language } = useLanguage(); // Get current language context
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
    const [socialPreferences, setSocialPreferences] = useState<Record<string, string>>({});
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [otherHobby, setOtherHobby] = useState("");
    const [musicGenre, setMusicGenre] = useState("");
    const [favoriteArtist, setFavoriteArtist] = useState("");
    const [bingeType, setBingeType] = useState("None");
    const [bingeList, setBingeList] = useState(["", "", ""]);
    const [comfortArtist, setComfortArtist] = useState("");
    const [favoriteComedian, setFavoriteComedian] = useState("");
    const [loading, setLoading] = useState(true);

    // Onboarding state
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Metadata for voice inputs (optional storage, currently just checking state)
    const [inputMetadata, setInputMetadata] = useState<Record<string, { inputMethod: 'typed' | 'voice', language: string }>>({});

    // Fetch Profile Data on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");
                if (res.status === 401) {
                    toast("Unauthorized", { description: "Please login to edit your profile." });
                    return;
                }
                const data = await res.json();

                if (data && Object.keys(data).length > 0) {
                    console.log("Fetched Profile Data:", data);

                    // Basic Details
                    const { socialPlatforms, socialPreferences, hobbies, musicDetails, entertainment, inputMetadata: savedMeta, ...basicData } = data;

                    // Filter out non-basic fields from formData spread
                    const cleanBasicData = { ...basicData };
                    ['id', 'userId', 'createdAt', 'updatedAt'].forEach(k => delete cleanBasicData[k]);
                    setFormData(cleanBasicData);

                    // Social Media
                    if (Array.isArray(socialPlatforms)) setSocialPlatforms(socialPlatforms);
                    if (socialPreferences) setSocialPreferences(socialPreferences);

                    // Hobbies
                    if (Array.isArray(hobbies)) {
                        const standard = hobbies.filter((h: string) => HOBBIES.includes(h));
                        const other = hobbies.find((h: string) => !HOBBIES.includes(h));
                        setHobbies(standard);
                        if (other) setOtherHobby(other);
                    }

                    // Music
                    if (musicDetails) {
                        setMusicGenre(musicDetails.genre || "");
                        setFavoriteArtist(musicDetails.artist || "");
                    }

                    // Entertainment
                    if (entertainment) {
                        setBingeType(entertainment.bingeType || "None");
                        if (Array.isArray(entertainment.bingeList)) setBingeList(entertainment.bingeList);
                        setComfortArtist(entertainment.comfortArtist || "");
                        setFavoriteComedian(entertainment.favoriteComedian || "");
                    }

                    if (savedMeta) {
                        setInputMetadata(savedMeta);
                    }

                    // Check if key profile fields are filled
                    const hasRequiredFields = data.gender && data.preferredLanguage && data.primaryConcern;
                    if (!hasRequiredFields) {
                        const onboardingDone = localStorage.getItem("nn_onboarding_editprofile_done");
                        if (onboardingDone !== "true") {
                            setShowOnboarding(true);
                        }
                    }
                } else {
                    // Profile is empty — check if onboarding was already completed
                    const onboardingDone = localStorage.getItem("nn_onboarding_editprofile_done");
                    if (onboardingDone !== "true") {
                        setShowOnboarding(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load profile", error);
                toast("Error", { description: "Could not load existing profile." });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleValueChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handlePlatformToggle = (platformId: string) => {
        setSocialPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        );
    };

    const handlePreferenceChange = (platformId: string, value: string) => {
        setSocialPreferences(prev => ({ ...prev, [platformId]: value }));
    };

    const handleMetadataChange = (fieldId: string, meta: { inputMethod: 'typed' | 'voice', language: string }) => {
        setInputMetadata(prev => ({ ...prev, [fieldId]: meta }));
    };

    const handleHobbyToggle = (hobby: string) => {
        setHobbies(prev =>
            prev.includes(hobby)
                ? prev.filter(h => h !== hobby)
                : [...prev, hobby]
        );
    };

    const handleBingeChange = (index: number, value: string) => {
        const newList = [...bingeList];
        newList[index] = value;
        setBingeList(newList);
    };

    const autofillProfile = () => {
        setFormData(DEFAULT_PROFILE);
        setSocialPlatforms(["youtube", "instagram"]);
        setSocialPreferences({
            youtube: "Standup comedies videos",
            instagram: "Reels and quotes"
        });
        setHobbies(["Watching videos", "Listening to music"]);
        setOtherHobby("Photography");
        setMusicGenre("Bollywood");
        setFavoriteArtist("Arijit Singh");
        setBingeType("Series");
        setBingeList(["Breaking Bad", "Stranger Things", "The Office"]);
        setComfortArtist("Prateek Kuhad");
        setFavoriteComedian("Anubhav Singh Bassi");
        toast("Profile Autofilled", {
            description: "Default values have been selected for you.",
        });
    };

    const saveProfile = async () => {
        setLoading(true);

        // Merge standard hobbies with other hobby
        const finalHobbies = [...hobbies];
        if (otherHobby && otherHobby.trim() !== "") {
            finalHobbies.push(otherHobby);
        }

        const finalData = {
            ...formData,
            socialPlatforms,
            socialPreferences,
            hobbies: finalHobbies,
            musicDetails: hobbies.includes("Listening to music") ? { genre: musicGenre, artist: favoriteArtist } : null,
            entertainment: {
                bingeType,
                bingeList: bingeType !== "None" ? bingeList : [],
                comfortArtist,
                favoriteComedian
            },
            inputMetadata // Save metadata to DB to support structured storage requirement
        };

        console.log("[FRONTEND] Saving Profile Payload:", finalData);

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("[FRONTEND] Save failed:", responseData);
                throw new Error("Failed to save profile: " + (responseData.error || response.statusText));
            }

            toast("Profile Saved", {
                description: "Your profile has been successfully updated.",
            });

            // Dismiss onboarding overlay on successful save
            if (showOnboarding) {
                setShowOnboarding(false);
                localStorage.setItem("nn_onboarding_editprofile_done", "true");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast("Error", {
                description: "Could not save profile. Check console for details.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {showOnboarding && <EditProfileOverlay formRef={formRef} />}
        <div
            ref={formRef}
            className="container mx-auto py-10 max-w-3xl animate-in fade-in-50"
            style={showOnboarding ? { position: "relative", zIndex: 100000 } : undefined}
        >
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
            <div className="space-y-6">

                {/* Core Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Details</CardTitle>
                        <CardDescription>
                            Help us understand your background for better matches.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        {Object.entries(DROPDOWN_OPTIONS).map(([key, options]) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                </Label>
                                <Select
                                    value={formData[key] || ""}
                                    onValueChange={(value) => handleValueChange(key, value)}
                                >
                                    <SelectTrigger id={key}>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.labels[language as 'en' | 'hi' | 'mr'] || option.labels.en}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Social Media Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media Interests</CardTitle>
                        <CardDescription>
                            Which platforms do you use most? This helps AI personalize content for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {SOCIAL_PLATFORMS.map(platform => (
                                <div key={platform.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => handlePlatformToggle(platform.id)}>
                                    <Checkbox
                                        id={platform.id}
                                        checked={socialPlatforms.includes(platform.id)}
                                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                                    />
                                    <Label htmlFor={platform.id} className="cursor-pointer font-medium">{platform.label}</Label>
                                </div>
                            ))}
                        </div>

                        {socialPlatforms.length > 0 && (
                            <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                                <Separator />
                                <h3 className="tex-sm font-semibold text-muted-foreground">Tell us a bit more...</h3>
                                {SOCIAL_PLATFORMS.filter(p => socialPlatforms.includes(p.id)).map(platform => (
                                    <div key={`pref-${platform.id}`} className="space-y-2">
                                        <InterviewField
                                            label={platform.label}
                                            value={socialPreferences[platform.id] || ""}
                                            onChange={(val) => handlePreferenceChange(platform.id, val)}
                                            prompt={platform.prompts}
                                            language={language}
                                            onMetadataChange={(meta) => handleMetadataChange(`social_${platform.id}`, meta)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Hobbies Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hobbies & Interests</CardTitle>
                        <CardDescription>What do you enjoy doing in your free time?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {HOBBIES.map(hobby => (
                                <div key={hobby} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`hobby-${hobby}`}
                                        checked={hobbies.includes(hobby)}
                                        onCheckedChange={() => handleHobbyToggle(hobby)}
                                    />
                                    <Label htmlFor={`hobby-${hobby}`} className="font-normal">{hobby}</Label>
                                </div>
                            ))}
                        </div>

                        {/* Special Logic for Listening to Music */}
                        {hobbies.includes("Listening to music") && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-2 animate-in slide-in-from-top-2 bg-muted/20 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label>Favorite Genre</Label>
                                    <Select value={musicGenre} onValueChange={setMusicGenre}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MUSIC_GENRES.map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Favorite Artist / Band</Label>
                                    <Input
                                        placeholder="e.g. Arijit Singh, Taylor Swift"
                                        value={favoriteArtist}
                                        onChange={(e) => setFavoriteArtist(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <Label className="mb-2 block text-sm font-medium">Other Hobbies (Optional)</Label>

                            <InterviewField
                                label="Other Hobbies"
                                value={otherHobby}
                                onChange={setOtherHobby}
                                prompt={{
                                    en: "Do you have any other hobbies or passions? Like photography, cooking, or sports?",
                                    hi: "क्या आपके कोई अन्य शौक या जुनून हैं? जैसे फोटोग्राफी, खाना बनाना या खेल?",
                                    mr: "तुम्हाला इतर काही छंद किंवा आवडी आहेत का? जसे की फोटोग्राफी, स्वयंपाक किंवा खेळ?"
                                }}
                                language={language}
                                onMetadataChange={(meta) => handleMetadataChange('otherHobby', meta)}
                                placeholder="e.g., Photography, Cooking..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Entertainment Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Entertainment & Relaxation</CardTitle>
                        <CardDescription>Share your comfort shows and music to help us know you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Binge List */}
                        <div className="space-y-4">
                            <Label>Favorite Binge List (Movies, Series, Comics)</Label>
                            <Select value={bingeType} onValueChange={setBingeType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BINGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            {bingeType !== "None" && (
                                <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2">
                                    <Label className="text-sm text-muted-foreground">Top 3 Favorites:</Label>
                                    {bingeList.map((item, idx) => (
                                        <Input
                                            key={idx}
                                            placeholder={`#${idx + 1} ${bingeType === 'Comics/Manga' ? 'Comic/Manga Name' : 'Title'}`}
                                            value={item}
                                            onChange={(e) => handleBingeChange(idx, e.target.value)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Interview Fields for Comfort */}
                        <div className="space-y-6">
                            <InterviewField
                                label="Favorite Comfort Artist"
                                value={comfortArtist}
                                onChange={setComfortArtist}
                                prompt={{
                                    en: "Who is your go-to comfort artist or musician when you want to relax?",
                                    hi: "जब आप आराम करना चाहते हैं तो आपका पसंदीदा कलाकार या संगीतकार कौन है?",
                                    mr: "जेव्हा तुम्हाला आराम करायचा असतो तेव्हा तुमचा आवडता कलाकार किंवा संगीतकार कोण असतो?"
                                }}
                                language={language}
                                onMetadataChange={(meta) => handleMetadataChange('comfortArtist', meta)}
                                placeholder="e.g. Prateek Kuhad"
                            />

                            <InterviewField
                                label="Favorite Comedian"
                                value={favoriteComedian}
                                onChange={setFavoriteComedian}
                                prompt={{
                                    en: "Who makes you laugh the most? Any favorite stand-up comedians?",
                                    hi: "आपको सबसे ज्यादा कौन हँसाता है? कोई पसंदीदा स्टैंड-अप कॉमेडियन?",
                                    mr: "तुम्हाला सर्वात जास्त कोण हसवते? कोणताही आवडता स्टँड-अप कॉमेडीयन?"
                                }}
                                language={language}
                                onMetadataChange={(meta) => handleMetadataChange('favoriteComedian', meta)}
                                placeholder="e.g. Zakir Khan"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="outline" onClick={autofillProfile}>
                            Autofill Profile
                        </Button>
                        <Button onClick={saveProfile} disabled={loading} size="lg" className="px-8">
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
        </>
    );
}
