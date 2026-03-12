"use client"

import * as React from "react"
import { ArrowLeft, MessageCircle, UserPlus, Shield, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"

export default function ConnectionProfilePage() {
    const router = useRouter()
    const params = useParams()
    // In a real app, fetch user data based on params.id

    return (
        <div className="flex-1 h-full overflow-y-auto p-6 bg-background">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Connections
                </Button>

                <Card className="overflow-hidden border-border/60">
                    <div className="h-32 bg-secondary/30 w-full relative">
                        {/* Cover Area */}
                    </div>
                    <CardHeader className="relative pb-0">
                        <div className="absolute -top-16 left-6">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary">AR</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="ml-40 pt-2 flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">Aarav Rao</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    @arao
                                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 text-[10px] py-0 h-5">
                                        <Shield className="h-3 w-3 mr-1" /> Verified
                                    </Badge>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.push('/buddy/chat?user=1')}>
                                    <MessageCircle className="mr-2 h-4 w-4" /> Message
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-8 space-y-6">
                        <div className="p-4 bg-muted/20 rounded-lg text-sm italic border text-center text-muted-foreground">
                            "Just looking for someone to share small daily wins with. dealing with work anxiety."
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Interests & Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Anxiety Support</Badge>
                                <Badge variant="secondary">Career Stress</Badge>
                                <Badge variant="secondary">Mindfulness</Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h4>
                                <p className="font-medium">December 2024</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Active</h4>
                                <p className="font-medium">2 minutes ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
