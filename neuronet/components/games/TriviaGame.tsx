"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TriviaGameProps {
    t: any
    onScore: (points: number) => void
    onEnd: (finalScore: number) => void
    isMini?: boolean
}

// Simple internal trivia pool for microtasks
const TRIVIA_POOL = [
    { q: "Laughter can lower cortisol (stress hormone) levels.", a: "True" },
    { q: "Spending time in nature is linked to better focus.", a: "True" },
    { q: "Your brain uses 20% of your body's total energy.", a: "True" },
    { q: "Social connection can strengthen your immune system.", a: "True" },
    { q: "Deep breathing can physically calm your nervous system.", a: "True" }
]

export default function TriviaGame({ t, onScore, onEnd, isMini }: TriviaGameProps) {
    const [fact] = useState(() => TRIVIA_POOL[Math.floor(Math.random() * TRIVIA_POOL.length)])
    const [isComplete, setIsComplete] = useState(false)

    const handleComplete = () => {
        onScore(4)
        setIsComplete(true)
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Insight Earned!</h3>
                    <p className="text-muted-foreground">Stay curious. +4 XP</p>
                </div>
                <Button onClick={() => onEnd(4)} className="bg-primary hover:bg-primary/90">
                    {t('offline_game_end')}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
            <div className="text-center">
                <h3 className="text-xl font-bold flex items-center gap-2 justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    {t('offline_game_trivia')}
                </h3>
            </div>

            <Card className="p-6 bg-yellow-50/50 dark:bg-yellow-950/10 border-yellow-200/50 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <p className="text-center text-lg font-medium leading-relaxed italic">
                    "{fact.q}"
                </p>
                <div className="mt-4 flex justify-center">
                   <div className="text-[10px] uppercase tracking-widest text-yellow-600/60 font-black">Mental Wellness Fact</div>
                </div>
            </Card>

            <Button onClick={handleComplete} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 rounded-xl shadow-lg">
                Awesome! <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
        </div>
    )
}
