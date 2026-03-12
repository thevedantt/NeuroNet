"use client"

import * as React from "react"
import { Check, X, Shield, Info, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const REQUESTS = [
    {
        id: "1",
        name: "Tanvi Rao",
        avatar: "TR",
        matchPercent: 95,
        sharedInterests: ["Anxiety Mgmt", "Meditation", "Art Therapy"],
        message: "Hi! I saw your profile and we have a lot in common. Would love to connect.",
        time: "2h ago"
    },
    {
        id: "2",
        name: "Aarav Mehta",
        avatar: "AM",
        matchPercent: 82,
        sharedInterests: ["Work Stress", "Yoga"],
        message: "Looking for an accountability partner for daily mindfulness.",
        time: "1d ago"
    },
    {
        id: "3",
        name: "Chetan P.",
        avatar: "CP",
        matchPercent: 65,
        sharedInterests: ["General Support"],
        message: "Hi there.",
        time: "3d ago"
    }
]

export default function RequestsPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-background max-w-4xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Buddy Requests</h1>
                <p className="text-muted-foreground mt-1">Review connection requests from potential buddies.</p>
            </header>

            <div className="space-y-4">
                {REQUESTS.map((req) => (
                    <Card key={req.id} className="border-border/60 bg-card/60 overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            {/* Avatar & Match Score */}
                            <div className="flex-none flex flex-col items-center gap-2 min-w-[100px]">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg bg-primary/10 text-primary">{req.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="text-center w-full">
                                    <span className="text-xs font-bold text-primary">{req.matchPercent}% Match</span>
                                    <Progress value={req.matchPercent} className="h-1.5 mt-1 bg-secondary" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{req.name}</h3>
                                        <span className="text-xs text-muted-foreground">{req.time}</span>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8">Profile</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{req.name}'s Profile</DialogTitle>
                                                <DialogDescription>Review their details before accepting.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback>{req.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium text-lg">{req.name}</h4>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Shield className="h-3 w-3" /> Verified User
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-muted/40 rounded-lg text-sm italic">
                                                    "{req.message}"
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium mb-2">Interests</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {req.sharedInterests.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter className="gap-2 sm:gap-0">
                                                <Button variant="destructive" className="w-full sm:w-auto">Decline</Button>
                                                <Button className="w-full sm:w-auto">Accept Connection</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="text-sm text-foreground/80 bg-muted/20 p-3 rounded-lg border border-border/40">
                                    "{req.message}"
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {req.sharedInterests.map(interest => (
                                        <Badge key={interest} variant="outline" className="bg-background/50 border-border/60 font-normal">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-none flex md:flex-col items-center justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l pl-0 md:pl-6 border-border/40 w-full md:w-auto">
                                <Button className="w-full md:w-32 bg-green-600 hover:bg-green-700 text-white">
                                    <Check className="mr-2 h-4 w-4" /> Accept
                                </Button>
                                <Button variant="outline" className="w-full md:w-32 hover:bg-red-50 hover:text-red-500 hover:border-red-200">
                                    <X className="mr-2 h-4 w-4" /> Decline
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {REQUESTS.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No pending requests.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
