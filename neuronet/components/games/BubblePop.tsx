"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Circle, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BubblePopProps {
    t: any
    onScore: (points: number) => void
    onEnd: (finalScore: number) => void
    isMini?: boolean
}

interface Bubble {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

export default function BubblePop({ t, onScore, onEnd, isMini }: BubblePopProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([])
    const [poppedCount, setPoppedCount] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const target = isMini ? 10 : 20

    const spawnBubble = useCallback(() => {
        const id = Math.random()
        const size = Math.random() * (isMini ? 40 : 60) + 30
        const x = Math.random() * 80 + 10 // 10% to 90%
        const duration = Math.random() * 5 + 8 // 8s to 13s (slow)
        
        setBubbles(prev => [...prev, { id, x, y: 110, size, duration, delay: 0 }])
        
        // Remove bubble after it floats away
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== id))
        }, duration * 1000)
    }, [isMini])

    useEffect(() => {
        const interval = setInterval(spawnBubble, 1500)
        return () => clearInterval(interval)
    }, [spawnBubble])

    const handlePop = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id))
        setPoppedCount(prev => {
            const next = prev + 1
            if (next >= target) setIsComplete(true)
            return next
        })
        onScore(1)
        
        // Sound effect (optional if exists)
        // new Audio('/sounds/pop.mp3').play().catch(() => {})
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Great Job!</h3>
                    <p className="text-muted-foreground">{target} bubbles popped. +{target} XP</p>
                </div>
                <Button onClick={() => onEnd(target)} className="bg-primary hover:bg-primary/90 rounded-xl px-8">
                    {t('offline_game_end')}
                </Button>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-50/20 to-indigo-50/20 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-[2rem] p-4">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Bubbles: {poppedCount}/{target}</span>
                </div>
                {!isMini && (
                     <Button variant="ghost" size="sm" onClick={() => onEnd(poppedCount)} className="text-xs font-bold uppercase tracking-widest pointer-events-auto">
                        End Task
                    </Button>
                )}
            </div>

            <AnimatePresence>
                {bubbles.map((b) => (
                    <motion.button
                        key={b.id}
                        initial={{ y: "120%", x: `${b.x}%`, scale: 0 }}
                        animate={{ y: "-20%", x: [`${b.x}%`, `${b.x + (Math.random() * 10 - 5)}%`, `${b.x}%`], scale: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ 
                            y: { duration: b.duration, ease: "linear" },
                            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            scale: { duration: 0.3 }
                        }}
                        style={{ width: b.size, height: b.size }}
                        className="absolute rounded-full bg-blue-400/30 backdrop-blur-sm border border-white/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center cursor-pointer group"
                        onClick={() => handlePop(b.id)}
                    >
                        <div className="w-1/3 h-1/3 bg-white/40 rounded-full blur-[2px] -translate-x-1 -translate-y-1" />
                    </motion.button>
                ))}
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <h3 className="text-4xl font-black uppercase tracking-[0.5em] text-primary/30">Pop Bubbles</h3>
            </div>
        </div>
    )
}
