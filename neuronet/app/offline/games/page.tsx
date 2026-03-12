"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Gamepad2, Trophy, History } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

import ColorGameShared from "@/components/games/ColorGame"
import ShapeGameShared from "@/components/games/ShapeGame"
import BreathingGameShared from "@/components/games/BreathingGame"
import BubblePopShared from "@/components/games/BubblePop"
import TracePathShared from "@/components/games/TracePath"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GameScores {
    total: number
    colorTap: number
    shapeMatch: number
    breath: number
    bubble: number
    trace: number
    history: { game: string, score: number, date: string }[]
}

export default function GamesPage() {
    const [activeGame, setActiveGame] = useState<'menu' | 'color' | 'shape' | 'breath' | 'bubble' | 'trace'>('menu')
    const { t } = useLanguage()
    const [scores, setScores] = useState<GameScores>({ 
        total: 0, 
        colorTap: 0, 
        shapeMatch: 0, 
        breath: 0,
        bubble: 0,
        trace: 0,
        history: [] 
    })

    useEffect(() => {
        const saved = localStorage.getItem('offline-game-scores')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setScores({
                    total: parsed.total || 0,
                    colorTap: parsed.colorTap || 0,
                    shapeMatch: parsed.shapeMatch || 0,
                    breath: parsed.breath || 0,
                    bubble: parsed.bubble || 0,
                    trace: parsed.trace || 0,
                    history: Array.isArray(parsed.history) ? parsed.history : []
                })
            } catch (e) {
                console.error("Failed to parse game scores", e)
            }
        }
    }, [])

    const updateScore = (gameName: keyof Omit<GameScores, 'total' | 'history'>, points: number) => {
        setScores(prev => {
            const currentScore = (prev[gameName] as number) || 0
            const newScore = Math.max(0, currentScore + points)
            const newTotal = Math.max(0, prev.total + points)
            const updated = {
                ...prev,
                total: newTotal,
                [gameName]: newScore
            }
            localStorage.setItem('offline-game-scores', JSON.stringify(updated))
            return updated
        })
    }

    const saveHistory = (gameName: string, roundScore: number) => {
        setScores(prev => {
            const newHistory = [{ game: gameName, score: roundScore, date: new Date().toLocaleDateString() }, ...prev.history].slice(0, 10)
            const updated = { ...prev, history: newHistory }
            localStorage.setItem('offline-game-scores', JSON.stringify(updated))
            return updated
        })
    }

    const GAMES = [
        { id: 'color', name: t('offline_game_color'), icon: '🎨', color: 'bg-green-50/50 dark:bg-green-950/20', border: 'hover:border-green-500/20' },
        { id: 'shape', name: t('offline_game_shape'), icon: '📐', color: 'bg-orange-50/50 dark:bg-orange-950/20', border: 'hover:border-orange-500/20' },
        { id: 'breath', name: t('offline_game_breath'), icon: '🌬️', color: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'hover:border-blue-500/20' },
        { id: 'bubble', name: t('offline_game_bubble'), icon: '🫧', color: 'bg-cyan-50/50 dark:bg-cyan-950/20', border: 'hover:border-cyan-500/20' },
        { id: 'trace', name: t('offline_game_trace'), icon: '✨', color: 'bg-indigo-50/50 dark:bg-indigo-950/20', border: 'hover:border-indigo-500/20' },
    ] as const

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-start">
            <AnimatePresence mode="wait">
                {activeGame === 'menu' ? (
                    <motion.div 
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                            </Link>
                            <h1 className="text-4xl font-black flex items-center justify-center gap-3">
                                <Gamepad2 className="w-10 h-10 text-primary" /> {t('offline_games')}
                            </h1>
                            <p className="text-muted-foreground max-w-md mx-auto">Focus and relax with these simple cognitive exercises.</p>
                        </div>

                        <div className="flex justify-center mb-8">
                            <motion.div 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-primary/10 text-primary px-8 py-4 rounded-3xl flex items-center gap-3 font-black text-2xl shadow-sm border border-primary/10"
                            >
                                <Trophy className="w-8 h-8" />
                                {t('offline_game_score')}: {scores.total}
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {GAMES.map((g) => (
                                <Card 
                                    key={g.id}
                                    className={`p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${g.border} flex flex-col items-center text-center group`}
                                    onClick={() => setActiveGame(g.id)}
                                >
                                    <div className={`w-full h-32 ${g.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500`}>
                                        <span className="text-5xl">{g.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">{g.name}</h3>
                                </Card>
                            ))}
                        </div>

                        {scores.history.length > 0 && (
                            <Card className="mt-8 p-6 border-none shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <History className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold uppercase tracking-widest text-sm">Recent Activity</h3>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-zinc-200 dark:border-zinc-800">
                                            <TableHead className="font-bold">Game</TableHead>
                                            <TableHead className="font-bold">Date</TableHead>
                                            <TableHead className="text-right font-bold">Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.history.map((h, i) => (
                                            <TableRow key={i} className="border-zinc-100 dark:border-zinc-800/50">
                                                <TableCell className="font-medium text-zinc-600 dark:text-zinc-400">
                                                    {h.game === 'colorTap' ? t('offline_game_color') : 
                                                     h.game === 'shapeMatch' ? t('offline_game_shape') :
                                                     h.game === 'breath' ? t('offline_game_breath') :
                                                     h.game === 'bubble' ? t('offline_game_bubble') :
                                                     t('offline_game_trace')}
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{h.date}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">+{h.score}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="game-container"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800"
                    >
                        <Button 
                            variant="ghost" 
                            onClick={() => setActiveGame('menu')} 
                            className="mb-6 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full pr-6"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
                        </Button>

                        <div className="h-[450px] flex flex-col items-center justify-center overflow-hidden">
                            {activeGame === 'color' && (
                                <ColorGameShared 
                                    t={t}
                                    onScore={(p) => updateScore('colorTap', p)}
                                    onEnd={(s) => { saveHistory('colorTap', s); setActiveGame('menu'); }}
                                />
                            )}
                            {activeGame === 'shape' && (
                                <ShapeGameShared 
                                    t={t}
                                    onScore={(p) => updateScore('shapeMatch', p)}
                                    onEnd={(s) => { saveHistory('shapeMatch', s); setActiveGame('menu'); }}
                                />
                            )}
                            {activeGame === 'breath' && (
                                <BreathingGameShared 
                                    t={t}
                                    onScore={(p) => updateScore('breath', p)}
                                    onEnd={(s) => { saveHistory('breath', s); setActiveGame('menu'); }}
                                />
                            )}
                            {activeGame === 'bubble' && (
                                <BubblePopShared 
                                    t={t}
                                    onScore={(p) => updateScore('bubble', p)}
                                    onEnd={(s) => { saveHistory('bubble', s); setActiveGame('menu'); }}
                                />
                            )}
                            {activeGame === 'trace' && (
                                <TracePathShared 
                                    t={t}
                                    onScore={(p) => updateScore('trace', p)}
                                    onEnd={(s) => { saveHistory('trace', s); setActiveGame('menu'); }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
