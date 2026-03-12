"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ShapeGameProps {
    onScore: (points: number) => void;
    onEnd: (finalScore: number) => void;
    t: (key: any) => string;
    isMini?: boolean;
}

export default function ShapeGame({ onScore, onEnd, t, isMini = false }: ShapeGameProps) {
    const [score, setScore] = useState(0)
    const [targetShape, setTargetShape] = useState('')
    const [shapes, setShapes] = useState<string[]>([])
    const [message, setMessage] = useState("")

    const allShapes = ['circle', 'square', 'triangle', 'diamond']
    const shapeKeys: Record<string, string> = {
        'circle': 'shape_circle',
        'square': 'shape_square',
        'triangle': 'shape_triangle',
        'diamond': 'shape_diamond'
    }

    const startRound = () => {
        const count = isMini ? 3 : 4
        const shuffled = [...allShapes].sort(() => 0.5 - Math.random()).slice(0, count)
        setShapes(shuffled)
        const target = shuffled[Math.floor(Math.random() * shuffled.length)]
        setTargetShape(target)
        
        const shapeName = t(shapeKeys[target]) || target.toUpperCase()
        setMessage(`${t('game_find_instruction') || 'FIND THE'} ${shapeName}`)
    }

    useEffect(() => {
        startRound()
    }, [])

    const handleTap = (shape: string) => {
        if (shape === targetShape) {
            const points = 15
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

            <div className={`text-center ${isMini ? 'mb-4' : 'mb-8'}`}>
                <h2 className={`${isMini ? 'text-2xl' : 'text-5xl'} font-black text-white mb-1`}>{score}</h2>
                <p className={`${isMini ? 'text-[10px]' : 'text-xl'} font-bold text-white/60 tracking-widest`}>{message}</p>
            </div>

            <div className={`flex items-center justify-center ${isMini ? 'gap-3' : 'gap-8'}`}>
                {shapes.map((s, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${isMini ? 'w-16 h-16' : 'w-32 h-32'} flex items-center justify-center bg-white/5 border-2 border-white/10 rounded-2xl hover:bg-white/10 transition-colors`}
                        onClick={() => handleTap(s)}
                    >
                        {s === 'circle' && <div className={`${isMini ? 'w-8 h-8' : 'w-16 h-16'} rounded-full bg-white/80`} />}
                        {s === 'square' && <div className={`${isMini ? 'w-8 h-8' : 'w-16 h-16'} bg-white/80`} />}
                        {s === 'triangle' && <div className={`w-0 h-0 ${isMini ? 'border-l-[16px] border-r-[16px] border-b-[32px]' : 'border-l-[32px] border-r-[32px] border-b-[64px]'} border-l-transparent border-r-transparent border-b-white/80`} />}
                        {s === 'diamond' && <div className={`${isMini ? 'w-8 h-8' : 'w-16 h-16'} bg-white/80 rotate-45`} />}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
