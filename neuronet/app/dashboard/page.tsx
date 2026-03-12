"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoodChart } from "@/components/dashboard/mood-chart"
import { StreakCard } from "@/components/dashboard/streak-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingAppointments } from "@/components/dashboard/appointments"
import { ProgressIndicators } from "@/components/dashboard/progress-indicators"
import { YoutubeFeed } from "@/components/dashboard/YoutubeFeed"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"

import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/context/LanguageContext"
import { useOffline } from "@/context/OfflineContext"
import { OfflineLanding } from "@/components/offline-landing"

function getInitials(name: string | undefined): string {
    if (!name) return "U"
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

function getDisplayName(email: string | undefined): string {
    if (!email) return "User"
    const local = email.split("@")[0]
    // Capitalize first letter
    return local.charAt(0).toUpperCase() + local.slice(1)
}

export default function DashboardPage() {
    const { t } = useLanguage()
    const { isOffline } = useOffline()
    const router = useRouter()
    const [userName, setUserName] = useState<string>("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (res.ok) {
                    const data = await res.json()
                    setUserName(getDisplayName(data.email))
                }
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }

        fetchUser()
    }, [])

    if (isOffline) {
        return <OfflineLanding />
    }

    const greetingText = t('greeting').replace('{name}', userName || 'User')
    const initials = getInitials(userName)

    return (
        <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">

                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{greetingText}</h1>
                        <p className="text-muted-foreground">{t('greeting_subtitle')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder={t('search_placeholder')} className="pl-8 bg-card ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring" />
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <LanguageToggle />
                    <ModeToggle />
                    <button
                        onClick={() => router.push("/profile")}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                        aria-label="Go to profile"
                    >
                        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="" alt={userName || "User"} />
                            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                        </Avatar>
                    </button>
                </div>
            </header>

            {/* Dashboard Content */}
            {/* Grid: 4 columns on large screens. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Row 1: Mood Chart (Wide) */}
                <MoodChart />

                {/* Row 2: Streak (1), Quick (1), Appointments (2) */}
                <StreakCard />
                <QuickActions />
                <UpcomingAppointments />

                {/* Row 3: Progress Indicators */}
                <ProgressIndicators />

                {/* Row 4: Personalized Content */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <YoutubeFeed />
                </div>
            </div>
        </div>
    )
}

