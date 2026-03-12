"use client"

import * as React from "react"
import Link from "next/link"
import { Search, MessageCircle, MoreHorizontal, UserCheck, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const CONNECTIONS = [
    { id: "1", name: "Aarav Rao", handle: "@arao", avatar: "AR", lastActive: "2 min ago", status: "online", mood: "Calm" },
    { id: "2", name: "Jay Chopra", handle: "@jchopra", avatar: "JC", lastActive: "1 hr ago", status: "offline", mood: "Reflective" },
    { id: "3", name: "Sameer S.", handle: "@sameer", avatar: "SS", lastActive: "Active today", status: "offline", mood: "Anxious" },
    { id: "4", name: "Kavya Verma", handle: "@kavya", avatar: "KV", lastActive: "Yesterday", status: "offline", mood: "Hopeful" },
    { id: "5", name: "Jatin L.", handle: "@jatin", avatar: "JL", lastActive: "2 days ago", status: "offline", mood: "Tired" },
]

export default function ConnectionsPage() {
    return (
        <div className="flex-1 h-full overflow-hidden flex flex-col p-6 md:p-8 bg-background">
            <header className="flex-none mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Connections</h1>
                        <p className="text-muted-foreground">Your network of supportive buddies.</p>
                    </div>
                    <Button variant="outline">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Find Connections
                    </Button>
                </div>
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search connections..." className="pl-9 bg-card border-border/60" />
                </div>
            </header>

            <ScrollArea className="flex-1 -mx-6 px-6">
                {CONNECTIONS.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {CONNECTIONS.map((buddy) => (
                            <Link href={`/buddy/connections/${buddy.id}`} key={buddy.id} className="block group">
                                <Card className="border-border/60 bg-card/60 hover:bg-card/90 transition-all hover:shadow-md cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                                <AvatarFallback className="bg-primary/10 text-primary text-lg">{buddy.avatar}</AvatarFallback>
                                            </Avatar>
                                            {buddy.status === "online" && (
                                                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">{buddy.name}</h3>
                                            <p className="text-sm text-muted-foreground">{buddy.handle}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-[10px] h-5 font-normal bg-secondary/50">
                                                    {buddy.mood}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">{buddy.lastActive}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="px-6 py-3 bg-muted/20 border-t border-border/40 flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground font-medium">Click to chat</span>
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                            <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold">No active buddies yet</h2>
                        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">Connect with others to build your support network. Check your requests or find a match.</p>
                        <Button>Find a Buddy</Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
