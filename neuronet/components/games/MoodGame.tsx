"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Smile, Meh, Frown, ThumbsUp, Heart, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MoodGameProps {
    t: any
    onScore: (points: number) => void
    onEnd: (finalScore: number) => void
    isMini?: boolean
}

export default function MoodGame({ t, onScore, onEnd, isMini }: MoodGameProps) {
    const [selectedMood, setSelectedMood] = useState<string | null>(null)
    const [isComplete, setIsComplete] = useState(false)

    const moods = [
        { key: "happy", icon: Smile, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
        { key: "calm", icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { key: "neutral", icon: Meh, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" },
        { key: "sad", icon: Frown, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
        { key: "anxious", icon: Heart, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ]

    const handleMoodSelect = (key: string) => {
        setSelectedMood(key)
        onScore(3)
        setIsComplete(true)
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">{t('mood_saved')}</h3>
                    <p className="text-muted-foreground">Self-awareness is key! +3 XP</p>
                </div>
                <Button onClick={() => onEnd(3)} className="bg-primary hover:bg-primary/90">
                    {t('offline_game_end')}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
            <div className="text-center">
                <h3 className="text-xl font-bold">{t('offline_game_mood')}</h3>
                <p className="text-sm text-muted-foreground">{t('mood_question')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                {moods.map((m) => (
                    <Card
                        key={m.key}
                        className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 border-2 hover:border-primary/20 ${selectedMood === m.key ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => handleMoodSelect(m.key)}
                    >
                        <div className={`p-2 rounded-full mb-2 ${m.bg}`}>
                            <m.icon className={`w-8 h-8 ${m.color}`} />
                        </div>
                        <span className="text-xs font-bold">{t(`mood_${m.key}` as any)}</span>
                    </Card>
                ))}
            </div>
        </div>
    )
}
