"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

import { useLanguage } from "@/context/LanguageContext"

export function UpcomingAppointments() {
    const { t } = useLanguage()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/appointments')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAppointments(data.appointments)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const upcoming = appointments.find(a => new Date(a.appointmentDate) >= new Date(new Date().setHours(0, 0, 0, 0))) || appointments[0];

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 shadow-md border-none flex flex-col h-full">
            <CardHeader>
                <CardTitle>{t("appt_title")}</CardTitle>
                <CardDescription>{t("appt_subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col xl:flex-row gap-6 items-center xl:items-start justify-center">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-3 pointer-events-none"
                    />
                </div>

                <div className="flex-1 space-y-4 w-full">
                    {loading ? (
                        <div className="p-4 border rounded-xl text-center text-sm text-muted-foreground">{t("appt_loading")}</div>
                    ) : upcoming ? (
                        <div className="flex items-center justify-between p-4 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div>
                                <p className="font-semibold">{upcoming.doctorSnapshot?.name || t("appt_unknown_doctor")}</p>
                                <p className="text-sm text-muted-foreground">{upcoming.sessionType}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <Badge variant="default" className="mb-1 bg-primary text-primary-foreground">
                                    {upcoming.status === 'scheduled' ? t("appt_upcoming") : upcoming.status}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(upcoming.appointmentDate).toLocaleDateString()} at {upcoming.appointmentTime}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 border rounded-xl bg-muted/30 text-center">
                            <p className="font-medium text-muted-foreground">{t("appt_no_upcoming")}</p>
                            <p className="text-xs text-muted-foreground">{t("appt_book_start")}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                        <div>
                            <p className="font-medium text-muted-foreground">{t("appt_wellness_circle")}</p>
                            <p className="text-sm text-muted-foreground">{t("appt_group_meditation")}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <Badge variant="secondary" className="mb-1">{t("appt_completed")}</Badge>
                            <p className="text-xs text-muted-foreground">Yesterday, 9:00 AM</p>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full">{t("appt_view_schedule")}</Button>
                </div>
            </CardContent>
        </Card>
    )
}
