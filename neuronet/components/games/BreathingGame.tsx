"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wind, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreathingGameProps {
    t: any
    onScore: (points: number) => void
    onEnd: (finalScore: number) => void
    isMini?: boolean
}

export default function BreathingGame({ t, onScore, onEnd, isMini }: BreathingGameProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
    const [cycleCount, setCycleCount] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [totalXP, setTotalXP] = useState(0)
    
    // Config: 3 cycles for mini, 5 for standard
    const targetCycles = isMini ? 3 : 5

    useEffect(() => {
        if (cycleCount >= targetCycles) {
            setIsComplete(true)
            return
        }

        const runCycle = async () => {
            // Inhale (4s)
            setPhase('inhale')
            await new Promise(r => setTimeout(r, 4000))
            
            // Hold (2s)
            setPhase('hold')
            await new Promise(r => setTimeout(r, 2000))
            
            // Exhale (4s)
            setPhase('exhale')
            await new Promise(r => setTimeout(r, 4000))
            
            // End of cycle
            setCycleCount(prev => prev + 1)
            onScore(2)
            setTotalXP(prev => prev + 2)
        }

        runCycle()
    }, [cycleCount, targetCycles])

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Mindfulness Complete</h3>
                    <p className="text-muted-foreground">You completed {targetCycles} cycles! +{totalXP} XP</p>
                </div>
                <Button onClick={() => onEnd(totalXP)} className="bg-primary hover:bg-primary/90 rounded-xl px-8">
                    {t('offline_game_end')}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 relative">
            <div className="absolute top-0 right-0 p-2 text-xs font-black uppercase tracking-widest opacity-30">
                Cycle {cycleCount + 1} / {targetCycles}
            </div>

            <div className="text-center">
                <h3 className="text-xl font-black flex items-center gap-2 justify-center text-primary uppercase tracking-tighter">
                    {t('offline_game_breath')}
                </h3>
                <motion.p 
                    key={phase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1"
                >
                    {phase === 'inhale' ? t('breath_inhale') : phase === 'hold' ? t('breath_hold') : t('breath_exhale')}
                </motion.p>
            </div>

            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Visual Circle Pulse */}
                <motion.div 
                    animate={{ 
                        scale: phase === 'inhale' ? [1, 1.5] : phase === 'exhale' ? [1.5, 1] : 1.5,
                        opacity: phase === 'hold' ? 0.3 : [0.1, 0.3, 0.1],
                        backgroundColor: phase === 'inhale' ? "#60a5fa" : phase === 'hold' ? "#818cf8" : "#3b82f6"
                    }}
                    transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full blur-2xl"
                />
                
                {/* Main Interactive Circle */}
                <motion.div 
                    animate={{ 
                        scale: phase === 'inhale' ? [1, 1.3] : phase === 'exhale' ? [1.3, 1] : 1.3,
                        backgroundColor: phase === 'inhale' ? "#60a5fa" : phase === 'hold' ? "#818cf8" : "#3b82f6"
                    }}
                    transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
                    className="w-40 h-40 rounded-full flex items-center justify-center z-10 shadow-[0_0_50px_rgba(59,130,246,0.3)] border-4 border-white/20"
                >
                    <Wind className="w-16 h-16 text-white" />
                </motion.div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
                {Array.from({ length: targetCycles }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${i < cycleCount ? 'bg-blue-500 w-4' : 'bg-muted'}`} 
                    />
                ))}
            </div>
        </div>
    )
}
