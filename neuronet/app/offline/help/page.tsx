"use client"

import { Card } from "@/components/ui/card"
import { ArrowLeft, Phone, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export default function HelpPage() {
    const { t } = useLanguage()

    const numbers = [
        { name: "TeleMANAS (Govt of India)", number: "14416", desc: "24/7 Free Mental Health Support" },
        { name: "Vandrevala Foundation", number: "1860 266 2345", desc: "Multilingual Counselling" },
        { name: "iCall (TISS)", number: "9152987821", desc: "Mon-Sat, 8 AM - 10 PM" },
        { name: "Kiran Helpline", number: "1800 599 0019", desc: "24/7 Mental Health Rehabilitation" },
    ]

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto h-full space-y-8 animate-in fade-in">
            <div>
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Phone className="w-8 h-8 text-primary" /> {t('offline_help_title')}
                </h1>
                <p className="text-muted-foreground">{t('offline_help_desc')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {numbers.map((n) => (
                    <Card key={n.number} className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold">{n.name}</h3>
                        <p className="text-2xl font-mono text-primary my-2">{n.number}</p>
                        <p className="text-sm text-muted-foreground">{n.desc}</p>
                        <div className="mt-4">
                            <a href={`tel:${n.number}`} className="text-sm font-semibold text-primary hover:underline bg-primary/10 px-4 py-2 rounded-full inline-block">
                                {t('help_call_now')}
                            </a>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-900/50 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-orange-800 dark:text-orange-400">{t('help_danger_title')}</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        {t('help_danger_desc')}
                    </p>
                </div>
            </div>
        </div>
    )
}
