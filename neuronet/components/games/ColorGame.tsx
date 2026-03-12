"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"

interface ColorGameProps {
    onScore: (points: number) => void;
    onEnd: (finalScore: number) => void;
    t: (key: any) => string;
    isMini?: boolean;
}

export default function ColorGame({ onScore, onEnd, t, isMini = false }: ColorGameProps) {
    const [score, setScore] = useState(0)
    const [targetColor, setTargetColor] = useState('')
    const [colors, setColors] = useState<string[]>([])
    const [message, setMessage] = useState("")

    const palette = [
        'bg-red-400', 'bg-blue-400', 'bg-green-400', 
        'bg-yellow-400', 'bg-purple-400', 'bg-orange-400', 
        'bg-pink-400', 'bg-teal-400'
    ]
    
    const colorKeys: Record<string, string> = {
        'bg-red-400': 'color_rose',
        'bg-blue-400': 'color_blue',
        'bg-green-400': 'color_green',
        'bg-yellow-400': 'color_yellow',
        'bg-purple-400': 'color_purple',
        'bg-orange-400': 'color_orange',
        'bg-pink-400': 'color_rose', // reuse or add pink to data
        'bg-teal-400': 'color_teal'
    }

    const startRound = () => {
        const shuffled = [...palette].sort(() => 0.5 - Math.random()).slice(0, isMini ? 4 : 6)
        setColors(shuffled)
        const target = shuffled[Math.floor(Math.random() * shuffled.length)]
        setTargetColor(target)
        
        const colorName = t(colorKeys[target]) || target.replace('bg-', '').replace('-400', '').toUpperCase()
        setMessage(colorName)
    }

    useEffect(() => {
        startRound()
    }, [])

    const handleTap = (color: string) => {
        if (color === targetColor) {
            const points = 10
            setScore(s => s + points)
            onScore(points)
            setMessage("✓")
            setTimeout(startRound, 400)
        } else {
            const penalty = 5
            setScore(s => Math.max(0, s - penalty))
            setMessage("✕")
        }
    }

    return (
        <div className={`flex flex-col items-center justify-center w-full animate-in zoom-in duration-300 ${isMini ? 'h-full p-2' : 'p-8'}`}>
            <Button 
                variant="ghost" 
                onClick={() => onEnd(score)} 
                className={`absolute ${isMini ? 'top-2 left-2 h-8 w-8 p-0' : 'top-8 left-8'}`}
            >
                <ArrowLeft className={isMini ? 'w-4 h-4' : 'w-4 h-4 mr-2'} /> 
                {!isMini && (t('offline_game_end') || 'End Game')}
            </Button>

            <div className={`text-center flex flex-col items-center ${isMini ? 'mb-4' : 'mb-8'}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${targetColor} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                    <span className={`${isMini ? 'text-[10px]' : 'text-sm'} uppercase tracking-[0.3em] font-black text-white/40`}>
                        {t('game_tap_instruction') || 'TAP'}
                    </span>
                    <div className={`w-4 h-4 rounded-full ${targetColor} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                </div>
                <h2 className={`${isMini ? 'text-3xl' : 'text-6xl'} font-black text-white uppercase tracking-tighter`}>
                    {message}
                </h2>
                <div className="mt-2 bg-white/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-primary">Score: {score}</span>
                </div>
            </div>

            <div className={`grid ${isMini ? 'grid-cols-2 gap-2' : 'grid-cols-3 gap-6'}`}>
                {colors.map((c, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${isMini ? 'w-16 h-16' : 'w-32 h-32'} rounded-2xl ${c} shadow-lg border-2 border-white/10 hover:border-white/30 transition-all`}
                        onClick={() => handleTap(c)}
                    />
                ))}
            </div>
        </div>
    )
}
