
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAppointment } from "@/context/AppointmentContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, Phone, Video } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
]

export default function BookingSchedulePage() {
    const router = useRouter()
    const { selectedDoctor } = useAppointment()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [timeSlot, setTimeSlot] = useState<string | undefined>()
    const [sessionType, setSessionType] = useState("Video Consultation")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Redirect if no doctor selected
    useEffect(() => {
        if (!selectedDoctor) {
            router.push("/appointments")
        }
    }, [selectedDoctor, router])

    if (!selectedDoctor) return null

    const handleConfirm = async () => {
        if (!date || !timeSlot) return

        setIsSubmitting(true)

        try {
            const bookingPayload = {
                doctorId: selectedDoctor.id,
                doctorSnapshot: selectedDoctor,
                appointmentDate: format(date, 'yyyy-MM-dd'),
                appointmentTime: timeSlot,
                sessionType: sessionType,
                price: selectedDoctor.price
            }

            console.log("🚀 Sending Booking Request:", bookingPayload)

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Booking Failed")

            console.log("✅ Booking Success (DB):", data)
            setShowSuccessModal(true)

        } catch (error) {
            console.error("❌ Booking Error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto w-full p-6 md:p-8 bg-background">
            <div className="max-w-5xl mx-auto w-full">
                <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground mb-6">
                    <Link href="/appointments">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Selection
                    </Link>
                </Button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Doctor Summary */}
                    <Card className="md:col-span-1 h-fit border-border/60 sticky top-4">
                        <div className="relative h-64 w-full">
                            <Image
                                src={selectedDoctor.image}
                                alt={selectedDoctor.name}
                                fill
                                className="object-cover rounded-t-xl"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">{selectedDoctor.name}</CardTitle>
                            <CardDescription className="text-primary font-medium">{selectedDoctor.specialization}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Price per session</span>
                                <span className="font-bold text-lg">₹{selectedDoctor.price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Experience</span>
                                <span className="font-medium">{selectedDoctor.experience} Years</span>
                            </div>
                            <div className="pt-2">
                                <Badge variant="secondary" className="w-full justify-center py-1">
                                    Highly Rated ({selectedDoctor.rating}/5.0)
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Booking Process */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Schedule Session</CardTitle>
                                <CardDescription>Select a suitable date and time for your consultation.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" /> Select Date
                                    </label>
                                    <div className="p-4 border rounded-md max-w-fit mx-auto md:mx-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                            className="rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Select Time
                                    </label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {TIME_SLOTS.map((slot) => (
                                            <Button
                                                key={slot}
                                                variant={timeSlot === slot ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setTimeSlot(slot)}
                                                className={timeSlot === slot ? "bg-primary text-primary-foreground" : ""}
                                            >
                                                {slot}
                                            </Button>
                                        ))}
                                    </div>
                                    {!timeSlot && <p className="text-xs text-muted-foreground">Please select a time slot.</p>}
                                </div>

                                {/* Session Type */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Video className="w-4 h-4" /> Session Type
                                    </label>
                                    <Select value={sessionType} onValueChange={setSessionType}>
                                        <SelectTrigger className="w-full md:w-[280px]">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Video Consultation">
                                                <div className="flex items-center gap-2">
                                                    <Video className="w-4 h-4" /> Video Consultation
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Voice Call Consultation">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" /> Voice Call Consultation
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t p-6 bg-secondary/10">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-bold text-lg ml-2">₹{selectedDoctor.price}</span>
                                </div>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={!date || !timeSlot || isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting ? "Confirming..." : "Confirm Booking"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="w-6 h-6" /> Booking Confirmed
                        </DialogTitle>
                        <DialogDescription>
                            Your session has been successfully scheduled.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs uppercase">Doctor</p>
                                <p className="font-semibold">{selectedDoctor.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase">Date</p>
                                <p className="font-medium">{date ? format(date, 'PPP') : ''}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase">Time</p>
                                <p className="font-medium">{timeSlot}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase">Type</p>
                                <p className="font-medium">{sessionType}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => router.push('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
