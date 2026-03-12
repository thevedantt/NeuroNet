"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Square, Wind } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { TranslationKey } from "@/data/translations"

export default function BreathingPage() {
    const [mode, setMode] = useState<'menu' | '1min' | '444'>('menu')
    const { t } = useLanguage()

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">

            {mode === 'menu' && (
                <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center space-y-2">
                        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                            <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                            <Wind className="w-8 h-8 text-primary" /> {t('offline_breathing')}
                        </h1>
                        <p className="text-muted-foreground">{t('breath_pattern_select')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20" onClick={() => setMode('1min')}>
                            <div className="h-40 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-4xl font-bold text-blue-500">1 min</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t('breath_quick_calm')}</h3>
                            <p className="text-muted-foreground">{t('breath_quick_desc')}</p>
                        </Card>

                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20" onClick={() => setMode('444')}>
                            <div className="h-40 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-4xl font-bold text-purple-500">4-4-4</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t('breath_box')}</h3>
                            <p className="text-muted-foreground">{t('breath_box_desc')}</p>
                        </Card>
                    </div>
                </div>
            )}

            {mode !== 'menu' && (
                <BreathingSession mode={mode} onExit={() => setMode('menu')} t={t} />
            )}
        </div>
    )
}

function BreathingSession({ mode, onExit, t }: { mode: '1min' | '444', onExit: () => void, t: any }) {
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
    const [timeLeft, setTimeLeft] = useState(mode === '1min' ? 60 : 120)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Breathing cycle logic
        let cycleTimer: NodeJS.Timeout

        const runCycle = () => {
            if (mode === '444') {
                // 4s Inhale, 4s Hold, 4s Exhale
                setPhase('Inhale')

                setTimeout(() => {
                    setPhase('Hold')
                    setTimeout(() => {
                        setPhase('Exhale')
                        // Repeat
                    }, 4000)
                }, 4000)
            } else {
                // 1 min: 4s Inhale, 6s Exhale
                setPhase('Inhale')
                setTimeout(() => {
                    setPhase('Exhale')
                }, 4000)
            }
        }

        // Initial run
        runCycle()

        // Loop
        const cycleDuration = mode === '444' ? 12000 : 10000
        cycleTimer = setInterval(runCycle, cycleDuration)

        return () => {
            clearInterval(timer)
            clearInterval(cycleTimer)
        }
    }, [mode])

    const getPhaseText = (p: string) => {
        if (p === 'Inhale') return t('breath_inhale')
        if (p === 'Exhale') return t('breath_exhale')
        if (p === 'Hold') return t('breath_hold')
        return p
    }

    return (
        <div className="flex flex-col items-center justify-center w-full animate-in zoom-in duration-500">
            <Button variant="ghost" onClick={onExit} className="absolute top-8 left-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> {t('breath_end_session')}
            </Button>

            <motion.div
                className="w-64 h-64 rounded-full bg-primary/20 flex items-center justify-center mb-12 relative"
                animate={{
                    scale: phase === 'Inhale' ? 1.5 : (phase === 'Hold' ? 1.5 : 1),
                    opacity: phase === 'Hold' ? 0.8 : 1
                }}
                transition={{
                    duration: mode === '444' ? 4 : (phase === 'Inhale' ? 4 : 6),
                    ease: "easeInOut"
                }}
            >
                <motion.div
                    className="w-full h-full rounded-full bg-primary/30 absolute"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <span className="text-4xl font-bold text-primary z-10">{getPhaseText(phase)}</span>
            </motion.div>

            <div className="text-center space-y-4">
                <p className="text-2xl font-light text-muted-foreground">{timeLeft}{t('seconds')} {t('remaining')}</p>
                <div className="flex gap-4 justify-center">
                    <Button variant="outline" size="lg" onClick={onExit}>{t('stop')}</Button>
                </div>
            </div>
        </div>
    )
}
