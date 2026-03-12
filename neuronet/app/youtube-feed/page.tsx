"use client";

import { YoutubeFeed } from "@/components/dashboard/YoutubeFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, HeartHandshake, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function YoutubeFeedPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [showPanel, setShowPanel] = useState(true);

    const labels = {
        en: {
            title: "Take a Moment for Yourself",
            subtitle: "We've curated this space to help you find some calm and comfort.",
            bookSession: "Book a Therapist Session",
            talkLater: "I'll Talk Later",
            supportText: "If you're ready to talk, professional support is just a click away."
        },
        hi: {
            title: "अपने लिए कुछ पल निकालें",
            subtitle: "हमने यह जगह विशेष रूप से आपकी शांति और सुकून के लिए बनाई है।",
            bookSession: "थेरेपिस्ट से सत्र बुक करें",
            talkLater: "मैं बाद में बात करूँगा",
            supportText: "यदि आप बात करने के लिए तैयार हैं, तो पेशेवर मदद बस एक क्लिक दूर है।"
        }
    };

    const text = labels[language as 'en' | 'hi'] || labels.en;

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground/80 tracking-tight">
                    {text.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {text.subtitle}
                </p>
            </div>

            {/* Feed */}
            <div className="max-w-6xl mx-auto">
                <YoutubeFeed />
            </div>

            {/* Booking Options Panel */}
            {showPanel && (
                <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center pointer-events-none">
                    <Card className="w-full max-w-xl shadow-2xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pointer-events-auto animate-in slide-in-from-bottom-5 duration-500">
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <HeartHandshake className="h-5 w-5" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-foreground">{text.supportText}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button variant="ghost" className="shrink-0" onClick={() => setShowPanel(false)}>
                                    {text.talkLater}
                                </Button>
                                <Button
                                    className="shrink-0 gap-2 bg-primary hover:bg-primary/90"
                                    onClick={() => router.push('/doctors')}
                                >
                                    <Calendar className="h-4 w-4" />
                                    {text.bookSession}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
