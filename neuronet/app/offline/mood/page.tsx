"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, Smile, Meh, Frown, ThumbsUp, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/context/LanguageContext"

export default function OfflineMoodPage() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)
    const { t } = useLanguage()

    const moods = [
        { label: "Happy", key: "happy", icon: Smile, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Calm", key: "calm", icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Neutral", key: "neutral", icon: Meh, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" },
        { label: "Sad", key: "sad", icon: Frown, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
        { label: "Anxious", key: "anxious", icon: Heart, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ]

    const handleSave = () => {
        if (!selectedMood) return

        const log = {
            id: Date.now(),
            mood: selectedMood,
            date: new Date().toISOString()
        }

        const existing = localStorage.getItem("offline-mood-logs")
        let logs = existing ? JSON.parse(existing) : []
        logs.push(log)
        localStorage.setItem("offline-mood-logs", JSON.stringify(logs))

        setSaved(true)
        toast.success(t('mood_saved'))
    }

    if (saved) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center animate-in fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('mood_saved')}</h2>
                <p className="text-muted-foreground mb-8">{t('mood_thank_you')}</p>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">{t('back_home')}</Link>
                    </Button>
                    <Button onClick={() => { setSaved(false); setSelectedMood(null); }}>{t('mood_again')}</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-12 max-w-3xl mx-auto h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
            <div className="w-full mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                </Link>
                <h1 className="text-3xl font-bold text-center mb-2">{t('mood_question')}</h1>
                <p className="text-center text-muted-foreground">{t('mood_select')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-8">
                {moods.map((m) => (
                    <Card
                        key={m.label}
                        className={`p-4 flex flex-col items-center cursor-pointer transition-all hover:scale-105 border-2 ${selectedMood === m.label ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/20'}`}
                        onClick={() => setSelectedMood(m.label)}
                    >
                        <div className={`p-3 rounded-full mb-3 ${m.bg}`}>
                            <m.icon className={`w-8 h-8 ${m.color}`} />
                        </div>
                        {/* TypeScript safe casting for dynamic key access if needed, or better just use property access in t() wrapper if I made it strict */}
                        <span className="font-medium">{t(`mood_${m.key}` as any)}</span>
                    </Card>
                ))}
            </div>

            <Button size="lg" className="w-full max-w-xs" disabled={!selectedMood} onClick={handleSave}>
                {t('save')}
            </Button>
        </div>
    )
}
