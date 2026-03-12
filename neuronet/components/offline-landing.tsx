"use client"

import Link from "next/link"
import { Wind, Gamepad2, BookOpen, Lightbulb, Phone, Smile } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"
import { TriviaCard } from "@/components/trivia-card"

export function OfflineLanding() {
    const { t } = useLanguage()

    const actions = [
        {
            title: t('offline_breathing'),
            icon: Wind,
            href: "/offline/breathing",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
            desc: "Calm your mind"
        },
        {
            title: t('offline_mood'),
            icon: Smile,
            href: "/offline/mood",
            color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
            desc: "Track your feelings"
        },
        {
            title: t('offline_games'),
            icon: Gamepad2,
            href: "/offline/games",
            color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            desc: "Relaxing distractions"
        },
        {
            title: t('offline_journal'),
            icon: BookOpen,
            href: "/offline/journal",
            color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
            desc: "Write it down"
        },
        {
            title: t('offline_tips'),
            icon: Lightbulb,
            href: "/offline/tips",
            color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
            desc: "Helpful advice"
        },
        {
            title: t('offline_help'),
            icon: Phone,
            href: "/offline/help",
            color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            desc: "Emergency contacts"
        },
    ]

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-4 text-center animate-in fade-in duration-700">
            <div className="mb-12 w-full max-w-4xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center ring-8 ring-muted/30">
                    <Wind className="w-10 h-10 text-primary/60" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-3">{t('offline_title')}</h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                    {t('offline_message')}
                </p>

                {/* PERSONALIZATION: Daily Trivia Card */}
                <div className="max-w-md mx-auto mb-8">
                    <TriviaCard />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {actions.map((action) => (
                    <Link key={action.title} href={action.href} className="block group">
                        <Card className="flex flex-col items-center p-6 h-full border hover:bg-muted/50 transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer">
                            <div className={`p-4 rounded-full mb-4 ${action.color} group-hover:brightness-110 transition-colors`}>
                                <action.icon className="w-7 h-7" />
                            </div>
                            <span className="font-semibold text-lg mb-1">{action.title}</span>
                            <span className="text-sm text-muted-foreground">{action.desc}</span>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
