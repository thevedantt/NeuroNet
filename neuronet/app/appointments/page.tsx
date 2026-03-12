"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock, Video, User, MapPin, MoreHorizontal, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { DOCTORS } from "@/data/doctors"
import { DoctorCard } from "@/components/doctors/DoctorCard"

const APPOINTMENTS = [
    {
        id: "1",
        therapist: "Dr. Ananya Sharma",
        type: "Video Session",
        date: new Date(2025, 11, 28, 14, 0), // Dec 28 2025
        duration: "50 min",
        status: "scheduled",
        avatar: "AS"
    },
    {
        id: "2",
        therapist: "Dr. Rahul Mehta",
        type: "Video Session",
        date: new Date(2025, 11, 20, 10, 0),
        duration: "50 min",
        status: "completed",
        avatar: "RM"
    }
]

export default function AppointmentsPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [activeTab, setActiveTab] = React.useState("upcoming")

    return (
        <div className="flex-1 overflow-y-auto w-full p-6 md:p-8 bg-background">
            <div className="max-w-6xl mx-auto w-full">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Appointments</h1>
                        <p className="text-muted-foreground mt-1">Manage your sessions and schedule new ones.</p>
                    </div>
                    <Button className="shadow-sm" onClick={() => setActiveTab("book")}>
                        <Plus className="mr-2 h-4 w-4" /> Book New Session
                    </Button>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Upcoming / Past List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                <TabsTrigger value="past">Past</TabsTrigger>
                                <TabsTrigger value="book">Find Therapist</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upcoming" className="space-y-4">
                                {APPOINTMENTS.filter(a => a.status === 'scheduled').length > 0 ? (
                                    APPOINTMENTS.filter(a => a.status === 'scheduled').map((apt) => (
                                        <AppointmentCard key={apt.id} appointment={apt} />
                                    ))
                                ) : (
                                    <EmptyState onBook={() => setActiveTab("book")} />
                                )}
                            </TabsContent>
                            <TabsContent value="past" className="space-y-4">
                                {APPOINTMENTS.filter(a => a.status === 'completed' || a.status === 'cancelled').map((apt) => (
                                    <AppointmentCard key={apt.id} appointment={apt} isPast />
                                ))}
                            </TabsContent>
                            <TabsContent value="book" className="space-y-6">
                                <div className="space-y-2 mb-4">
                                    <h3 className="text-lg font-semibold">Available Specialists</h3>
                                    <p className="text-sm text-muted-foreground">Select a therapist to book a session.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {DOCTORS.map((doctor) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right: Calendar & Mini Widget */}
                    <div className="space-y-6">
                        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Calendar</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex justify-center pb-4">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border-0"
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader>
                                <CardTitle className="text-base text-primary">Need urgent help?</CardTitle>
                                <CardDescription>Our crisis team is available 24/7.</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="destructive" className="w-full text-xs">Contact Crisis Support</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AppointmentCard({ appointment, isPast }: { appointment: any, isPast?: boolean }) {
    return (
        <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row items-start md:items-center p-6 gap-6">
                {/* Date Box */}
                <div className="flex-none flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl min-w-[80px]">
                    <span className="text-xs uppercase font-bold text-muted-foreground">{appointment.date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-bold text-foreground">{appointment.date.getDate()}</span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={isPast ? "secondary" : "default"} className={cn("rounded-sm font-normal", !isPast && "bg-primary text-primary-foreground hover:bg-primary/90")}>
                            {isPast ? "Completed" : "Upcoming"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Video className="h-3 w-3" /> {appointment.type}
                        </span>
                    </div>
                    <h3 className="font-semibold text-lg">{appointment.therapist}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {appointment.duration}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex-none flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="outline" className="w-full md:w-auto">View Details</Button>
                    {!isPast && (
                        <Button className="w-full md:w-auto">Join</Button>
                    )}
                </div>
            </div>
        </Card>
    )
}

function EmptyState({ onBook }: { onBook?: () => void }) {
    return (
        <Card className="min-h-[200px] flex flex-col items-center justify-center p-8 text-center border-dashed">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">No upcoming sessions</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">You have no appointments scheduled at the moment.</p>
            <Button onClick={onBook}>Schedule a Session</Button>
        </Card>
    )
}
