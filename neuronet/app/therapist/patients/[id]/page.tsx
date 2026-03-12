"use client"

import * as React from "react"
import {
    Activity,
    Calendar,
    FileText,
    MessageSquare,
    Phone,
    TrendingUp,
    User,
    AlertTriangle,
    ClipboardList,
    Shield,
    ShieldCheck,
    Lock,
    Loader2,
    Eye,
    ChevronDown,
    ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types for shared chat data
type SharedGrant = {
    grantId: number
    patientUserId: string
    patientWallet: string
    sessionId: number
    ipfsCid: string
    grantedAt: string
    isActive: boolean
}

type ChatMessage = {
    sender: string
    text: string
    timestamp: string
}

type DecryptedChat = {
    sessionId: number
    userId: string
    messages: ChatMessage[]
    exportedAt: string
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)

    // Mock patients lookup for non-UUID ids
    const mockPatients: Record<string, any> = {
        "1": { name: "Arjun Watsa", age: 28, diagnosis: "Generalized Anxiety Disorder", status: "Active", risk: "Low", image: "/avatars/01.png", nextSession: "Tomorrow, 2:00 PM" },
        "2": { name: "Chandni Bakshi", age: 32, diagnosis: "Major Depressive Disorder", status: "Active", risk: "Moderate", image: "/avatars/02.png", nextSession: "Today, 09:00 AM" },
        "3": { name: "Jai Chopra", age: 24, diagnosis: "PTSD", status: "Inactive", risk: "High", image: "/avatars/03.png", nextSession: "Pending" },
        "4": { name: "Girish M.", age: 35, diagnosis: "Social Anxiety", status: "Active", risk: "Low", image: "/avatars/04.png", nextSession: "Tomorrow, 11:30 AM" },
    }

    const isUUID = id.includes("-")
    const [patient, setPatient] = React.useState(
        mockPatients[id] || {
            name: "Loading...",
            age: "—",
            diagnosis: "—",
            status: "Active",
            risk: "—",
            image: "/avatars/01.png",
            nextSession: "—",
        }
    )

    // Shared Chat Records State
    const [sharedGrants, setSharedGrants] = React.useState<SharedGrant[]>([])
    const [loadingGrants, setLoadingGrants] = React.useState(false)
    const [expandedSession, setExpandedSession] = React.useState<number | null>(null)
    const [chatData, setChatData] = React.useState<Record<number, DecryptedChat>>({})
    const [loadingChat, setLoadingChat] = React.useState<number | null>(null)

    // Fetch real patient info if UUID
    React.useEffect(() => {
        if (isUUID) {
            fetch(`/api/therapist/patient-info?patientId=${id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.email) {
                        setPatient((prev: any) => ({
                            ...prev,
                            name: data.email.split("@")[0],
                            email: data.email,
                            diagnosis: "Shared via Encrypted Channel",
                            status: "Active",
                            risk: "—",
                        }))
                    }
                })
                .catch(err => console.error("Failed to fetch patient info:", err))
        }
    }, [id, isUUID])

    // Fetch shared records when Chat tab is selected (or auto for UUID patients)
    const fetchSharedRecords = React.useCallback(async () => {
        setLoadingGrants(true)
        try {
            const res = await fetch("/api/therapist/shared-records")
            const data = await res.json()
            if (res.ok) {
                // Filter grants for this specific patient
                const allGrants = data.grants || []
                if (isUUID) {
                    setSharedGrants(allGrants.filter((g: SharedGrant) => g.patientUserId === id))
                } else {
                    setSharedGrants(allGrants)
                }
            }
        } catch (err) {
            console.error("Failed to fetch shared records:", err)
        } finally {
            setLoadingGrants(false)
        }
    }, [id, isUUID])

    // Auto-fetch shared records for UUID patients
    React.useEffect(() => {
        if (isUUID) {
            fetchSharedRecords()
        }
    }, [isUUID, fetchSharedRecords])

    // Decrypt and view a specific shared chat session
    const viewChatSession = async (grant: SharedGrant) => {
        if (chatData[grant.grantId]) {
            // Already loaded, just toggle
            setExpandedSession(expandedSession === grant.grantId ? null : grant.grantId)
            return
        }

        setLoadingChat(grant.grantId)
        setExpandedSession(grant.grantId)
        try {
            const res = await fetch("/api/therapist/shared-records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grantId: grant.grantId,
                    patientWalletAddress: grant.patientWallet,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setChatData(prev => ({ ...prev, [grant.grantId]: data.data }))
            } else {
                console.error("Decrypt failed:", data.error)
            }
        } catch (err) {
            console.error("Failed to view chat:", err)
        } finally {
            setLoadingChat(null)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 animate-in fade-in-50">

            {/* Header Profile Card */}
            <Card className="border-none shadow-md bg-gradient-to-r from-background to-muted/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                                <AvatarImage src={patient.image} />
                                <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" /> {patient.age} yrs • {patient.diagnosis}
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{patient.status}</Badge>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Risk: {patient.risk}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" /> Treatment Plan
                            </Button>
                            <Button>
                                <Calendar className="mr-2 h-4 w-4" /> Schedule Session
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue={isUUID ? "chat" : "overview"} className="space-y-4">
                <TabsList className="h-auto w-full justify-start overflow-x-auto p-1 bg-transparent border-b rounded-none gap-2">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="assessments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm">Assessment History</TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm">Session Notes</TabsTrigger>
                    <TabsTrigger
                        value="chat"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm"
                        onClick={() => fetchSharedRecords()}
                    >
                        <Shield className="h-3.5 w-3.5 mr-1.5" />
                        Chat History
                    </TabsTrigger>
                    <TabsTrigger value="mood" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm">Mood Graphs</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last PHQ-9 Score</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">-2 pts since last month</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Next Session</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold truncate">{patient.nextSession}</div>
                                <p className="text-xs text-muted-foreground">Video Consultation</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1 shadow-sm border-l-4 border-l-orange-400">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                    Recent Flag
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Patient reported increased anxiety levels related to &quot;workplace performance&quot; in the last chat session (2 days ago).
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Quick Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <p>• Responded well to CBT techniques regarding sleep hygiene.</p>
                                <p>• Needs follow-up on medication adherence.</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Assessments Tab */}
                <TabsContent value="assessments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assessment Timeline</CardTitle>
                            <CardDescription>PHQ-9 and GAD-7 scores over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" /> Chart Visualization Placeholder
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Session Notes Tab */}
                <TabsContent value="notes" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Session Notes History</CardTitle>
                            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Note</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-sm">Session #{10 - i} - Cognitive Restructuring</h4>
                                        <span className="text-xs text-muted-foreground">Mar {20 - i}, 2024</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Patient discussed progress with exposure exercises. Reported lower anxiety in social situations (SUDS 40/100).
                                        Agreed to continue current homework plan.
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ============================== */}
                {/* CHAT HISTORY TAB (NEW - WIRED) */}
                {/* ============================== */}
                <TabsContent value="chat" className="space-y-4">

                    {/* Info Banner */}
                    <Card className="border-primary/20 bg-primary/5 shadow-none">
                        <CardContent className="p-4 flex items-start gap-3">
                            <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">End-to-End Encrypted Chat Records</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    These chat sessions were encrypted by the patient and shared with you via IPFS.
                                    Access is verified on-chain through Polygon Amoy smart contract. The patient can revoke access at any time.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loading State */}
                    {loadingGrants && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                            <span className="text-sm text-muted-foreground">Loading shared records...</span>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loadingGrants && sharedGrants.length === 0 && (
                        <Card className="shadow-sm">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">No Shared Records</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    The patient has not shared any AI chat sessions with you yet.
                                    They can share sessions from their Chat AI page using their encrypted wallet.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shared Sessions List */}
                    {!loadingGrants && sharedGrants.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Shared Sessions ({sharedGrants.length})
                                </h3>
                                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={fetchSharedRecords}>
                                    Refresh
                                </Button>
                            </div>

                            {sharedGrants.map((grant) => (
                                <Card key={grant.grantId} className="shadow-sm overflow-hidden">
                                    {/* Session Header */}
                                    <button
                                        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                                        onClick={() => viewChatSession(grant)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <MessageSquare className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Session #{grant.sessionId}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
                                                        <ShieldCheck className="h-2.5 w-2.5 mr-1" />
                                                        Verified Access
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        Shared {new Date(grant.grantedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {loadingChat === grant.grantId ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                    {expandedSession === grant.grantId
                                                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Chat Content */}
                                    {expandedSession === grant.grantId && chatData[grant.grantId] && (
                                        <div className="border-t">
                                            {/* Chat Metadata */}
                                            <div className="px-4 py-2 bg-muted/20 flex items-center gap-4 text-[10px] text-muted-foreground">
                                                <span>Messages: {chatData[grant.grantId].messages.length}</span>
                                                <span>Exported: {new Date(chatData[grant.grantId].exportedAt).toLocaleString()}</span>
                                                <span className="font-mono">CID: {grant.ipfsCid.slice(0, 16)}...</span>
                                            </div>

                                            {/* Messages */}
                                            <ScrollArea className="max-h-[500px]">
                                                <div className="p-4 space-y-3">
                                                    {chatData[grant.grantId].messages.map((msg, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                                msg.sender === 'user'
                                                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                                    : 'bg-muted/50 border border-border/60 rounded-bl-sm'
                                                            }`}>
                                                                <p>{msg.text}</p>
                                                                <span className={`text-[10px] block mt-1 ${
                                                                    msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground/50'
                                                                }`}>
                                                                    {msg.sender === 'user' ? '👤 Patient' : '🤖 AI'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Mood Graphs Tab */}
                <TabsContent value="mood" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Emotional Tone Over Time</CardTitle>
                            <CardDescription>Based on AI-analyzed chat insights (Calmness & Openness)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" /> Mood Visualization Placeholder
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}

function Plus(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
