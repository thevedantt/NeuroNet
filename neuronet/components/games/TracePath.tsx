"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, CheckCircle2, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TracePathProps {
    t: any
    onScore: (points: number) => void
    onEnd: (finalScore: number) => void
    isMini?: boolean
}

export default function TracePath({ t, onScore, onEnd, isMini }: TracePathProps) {
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [checkpoints, setCheckpoints] = useState<{x: number, y: number}[]>([])
    
    useEffect(() => {
        // Generate a zigzag or curve path based on container size
        const points = [
            { x: 10, y: 50 },
            { x: 30, y: 20 },
            { x: 50, y: 80 },
            { x: 70, y: 20 },
            { x: 90, y: 50 }
        ]
        setCheckpoints(points)
    }, [])

    const handleHover = (index: number) => {
        if (index === progress) {
            const next = index + 1
            setProgress(next)
            if (next >= checkpoints.length) {
                setIsComplete(true)
                onScore(3)
            }
        }
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Path Completed</h3>
                    <p className="text-muted-foreground">Steady hand! +3 XP</p>
                </div>
                <Button onClick={() => onEnd(3)} className="bg-primary hover:bg-primary/90 rounded-xl px-8">
                    {t('offline_game_end')}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-4 relative select-none">
            <div className="text-center">
                <h3 className="text-xl font-black flex items-center gap-2 justify-center text-primary uppercase tracking-tighter">
                    Trace the Path
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    Follow the glowing dots
                </p>
            </div>

            <div className="relative w-full h-64 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-primary/20 overflow-hidden">
                {/* SVG Path Background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                        d={`M ${checkpoints.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                        className="text-primary/10"
                    />
                    {progress > 0 && (
                         <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / (checkpoints.length - 1) }}
                            d={`M ${checkpoints.slice(0, progress + 1).map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-primary"
                        />
                    )}
                </svg>

                {/* Checkpoints */}
                {checkpoints.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ 
                            scale: 1,
                            backgroundColor: i < progress ? "#3b82f6" : i === progress ? "#fbbf24" : "#e4e4e7"
                        }}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-crosshair z-10`}
                        onMouseEnter={() => handleHover(i)}
                        onTouchStart={() => handleHover(i)}
                    >
                        {i < progress ? (
                            <Sparkles className="w-4 h-4 text-white" />
                        ) : i === progress ? (
                            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                        ) : (
                            <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                        )}
                    </motion.div>
                ))}

                {progress === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                            <MousePointer2 className="w-8 h-8 animate-bounce" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Start here</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div 
                    animate={{ width: `${(progress / checkpoints.length) * 100}%` }}
                    className="h-full bg-primary"
                />
            </div>
        </div>
    )
}
