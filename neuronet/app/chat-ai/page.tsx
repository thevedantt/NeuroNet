"use client"

import * as React from "react"
import { Sparkles, User, PanelRightOpen, PanelRightClose, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceChatInput } from "@/components/chat/VoiceChatInput"
import { ShareAccessDialog } from "@/components/chat/ShareAccessDialog"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { getOfflineResponse } from "@/lib/offline-support"

// Types
type Message = {
    id: string
    role: "user" | "ai"
    content: string
    timestamp: Date
    emotion?: string
    isOffline?: boolean
}

export default function ChatPage() {
    const { language, t } = useLanguage()

    // Language-specific greetings handled via t() now

    const [input, setInput] = React.useState("")
    const [messages, setMessages] = React.useState<Message[]>([])
    const [sessionId, setSessionId] = React.useState<number | null>(null)
    const [lastInsight, setLastInsight] = React.useState<any>(null)

    // Set initial greeting based on language
    React.useEffect(() => {
        setMessages([
            {
                id: "1",
                role: "ai",
                content: t("chat_greeting"),
                timestamp: new Date(),
                emotion: "warmth"
            }
        ])
    }, [language, t])

    const [status, setStatus] = React.useState<"Listening" | "Thinking" | "Idle">("Listening")
    const [showInsight, setShowInsight] = React.useState(true)
    const [isTyping, setIsTyping] = React.useState(false)
    const [summary, setSummary] = React.useState<string | null>(null)
    const [isSummarizing, setIsSummarizing] = React.useState(false)
    const [showSummaryDialog, setShowSummaryDialog] = React.useState(false)

    // Crisis Alert State
    const [showCrisisAlert, setShowCrisisAlert] = React.useState(false)
    const [redirectCountdown, setRedirectCountdown] = React.useState(6)

    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (showCrisisAlert && redirectCountdown > 0) {
            timer = setTimeout(() => setRedirectCountdown(prev => prev - 1), 1000)
        } else if (showCrisisAlert && redirectCountdown === 0) {
            window.location.href = "/youtube-feed"
        }
        return () => clearTimeout(timer)
    }, [showCrisisAlert, redirectCountdown])


    // Auto-scroll
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setStatus("Thinking")
        setIsTyping(true)

        // OFFLINE CHECK
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            // Simulate short processing delay for UX consistency
            setTimeout(() => {
                const offlineRes = getOfflineResponse(userMessage.content, language);

                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: offlineRes.content,
                    timestamp: new Date(),
                    emotion: "neutral",
                    isOffline: true
                }

                setMessages(prev => [...prev, aiMessage])
                setStatus("Listening") // Reset status
                setIsTyping(false)     // Reset typing
            }, 600) // 600ms delay

            return; // EXIT early, do not fetch
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    sessionId: sessionId,
                    language: language
                })
            })

            const data = await response.json()

            if (response.ok) {
                // Check for Crisis Action
                if (data.action === "crisis_alert") {
                    setShowCrisisAlert(true)
                }

                if (data.sessionId) setSessionId(data.sessionId)
                if (data.insight) setLastInsight(data.insight)

                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: data.content,
                    timestamp: new Date(),
                    emotion: data.emotion || "neutral"
                }
                setMessages(prev => [...prev, aiMessage])
            } else {
                console.error("Failed to get response:", data.error)

                let errorMessage = t("chat_error_connect");

                if (response.status === 429) {
                    errorMessage = t("chat_error_quota");
                }

                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: "ai",
                    content: errorMessage,
                    timestamp: new Date(),
                    emotion: "neutral"
                }])
            }
        } catch (error) {
            console.error("Error sending message:", error)
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "ai",
                content: t("chat_error_server"),
                timestamp: new Date(),
                emotion: "neutral"
            }])
        } finally {
            setStatus("Listening")
            setIsTyping(false)
        }
    }

    const handleSummarize = async () => {
        if (!sessionId) return
        setIsSummarizing(true)
        try {
            const res = await fetch("/api/chat/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, language })
            })
            const data = await res.json()
            if (res.ok) {
                setSummary(data.summary)
            } else {
                console.error("Summarization error:", data.error)
                if (res.status === 429) {
                    setSummary(language === 'hi' ? "कोटा सीमा पार हो गई है। कृपया थोड़ी देर बाद प्रयास करें।" : "Quota limit exceeded. Please try again later.")
                }
            }
        } catch (err) {
            console.error("Summarization failed:", err)
        } finally {
            setIsSummarizing(false)
        }
    }

    return (
        <div className="flex h-full max-h-screen overflow-hidden w-full relative">
            {/* Crisis Alert Overlay */}
            {showCrisisAlert && (
                <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <Card className="w-full max-w-2xl p-8 border-none bg-transparent shadow-none text-center space-y-6">

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-snug">
                                {language === 'hi'
                                    ? "आप जो महसूस कर रहे हैं, वह गंभीर है और महत्वपूर्ण है।"
                                    : "What you’re feeling right now is serious, and it matters."}
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                                {language === 'hi'
                                    ? "खुद को नुकसान पहुँचाना समाधान नहीं है — मदद उपलब्ध है और आप इसके हक़दार हैं। चलिए कुछ पल शांति से लेते हैं।"
                                    : "Hurting yourself is not the solution — support is available, and you deserve it. Let’s take a moment to slow things down together."}
                            </p>
                        </div>

                        {/* Visual Timer Indicator */}
                        <div className="flex justify-center py-6">
                            <div className="h-1 w-24 bg-primary/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-linear"
                                    style={{ width: `${(redirectCountdown / 6) * 100}%` }}
                                />
                            </div>
                        </div>

                    </Card>
                </div>
            )}

            {/* Main Chat Area */}

            <div className="flex-1 flex flex-col h-full bg-background relative w-full">
                {/* Header */}
                <header className="flex-none h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between z-10 w-full">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage src="/ai-avatar.png" />
                            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-lg font-semibold leading-none">AI Companion</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "h-2 w-2 rounded-full animate-pulse",
                                    status === "Listening" ? "bg-green-500" : "bg-yellow-500"
                                )} />
                                <span className="text-xs text-muted-foreground font-medium">{status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowInsight(!showInsight)} className="hidden md:flex">
                            {showInsight ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                        </Button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 w-full scrollbot-container" ref={scrollRef}>
                    <div className="mx-auto max-w-3xl space-y-6 pb-4 w-full">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full gap-3",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === "ai" && (
                                    <Avatar className="h-8 w-8 mt-1 border border-primary/10 flex-shrink-0">
                                        <AvatarFallback className="bg-primary/5 text-xs">AI</AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={cn(
                                    "relative max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-primary/5 border border-primary/10 text-foreground rounded-bl-sm"
                                )}>
                                    {msg.content}
                                    {msg.emotion && (
                                        <div className="mt-2 flex items-center gap-1.5 opacity-80">
                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-primary/20 bg-primary/5 text-primary">
                                                {msg.emotion}
                                            </Badge>
                                        </div>
                                    )}
                                    <span className={cn(
                                        "text-[10px] absolute bottom-1 right-3",
                                        msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground/50"
                                    )}>
                                        {msg.isOffline && <span className="mr-2 opacity-80 italic">{t("chat_offline_mode")}</span>}
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {msg.role === "user" && (
                                    <Avatar className="h-8 w-8 mt-1 border border-primary/10 flex-shrink-0">
                                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">ME</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex w-full gap-3 justify-start">
                                <Avatar className="h-8 w-8 mt-1 border border-primary/10 flex-shrink-0">
                                    <AvatarFallback className="bg-primary/5 text-xs">AI</AvatarFallback>
                                </Avatar>
                                <div className="bg-primary/5 border border-primary/10 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-none p-4 md:p-6 bg-background/95 backdrop-blur border-t z-10 w-full">
                    <div className="mx-auto max-w-3xl relative w-full">
                        <VoiceChatInput
                            value={input}
                            onChange={setInput}
                            onSend={handleSend}
                            disabled={status === "Thinking" || isTyping}
                        />
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-muted-foreground/60">
                                AI is trained to be supportive but is not a substitute for professional therapy.
                                <span className="underline cursor-pointer hover:text-primary ml-1">Crisis Resources</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Panel (Right Sidebar) */}
            {showInsight && (
                <div className="w-80 border-l bg-card/50 backdrop-blur-sm hidden md:flex flex-col h-full animate-in slide-in-from-right-5 duration-300">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Live Insights
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <Card className="p-4 bg-background/50 border-border/60 shadow-none">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Current Topic</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-0">
                                    {lastInsight?.topic || (language === 'hi' ? "प्रतीक्षा..." : "Waiting...")}
                                </Badge>
                            </div>
                        </Card>

                        <Card className="p-4 bg-background/50 border-border/60 shadow-none">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Emotional Tone</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Calmness</span>
                                        <span className="font-medium">{lastInsight?.tone?.Calmness || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500/70 rounded-full transition-all duration-500"
                                            style={{ width: `${lastInsight?.tone?.Calmness || 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Openness</span>
                                        <span className="font-medium">{lastInsight?.tone?.Openness || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500/70 rounded-full transition-all duration-500"
                                            style={{ width: `${lastInsight?.tone?.Openness || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-primary/5 border-primary/10 shadow-none">
                            <h4 className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Suggestion</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {lastInsight?.suggestion || (language === 'hi' ? "बातचीत जारी रखें..." : "Continue conversation for insights...")}
                            </p>
                            {lastInsight?.suggestion && (
                                <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-7 border-primary/20 hover:bg-primary/10 hover:text-primary bg-transparent text-foreground">
                                    {language === 'hi' ? "अभ्यास शुरू करें" : "Start Activity"}
                                </Button>
                            )}
                        </Card>

                        {/* Summary Section */}
                        {sessionId && (
                            <Card className="p-4 bg-background/50 border-border/60 shadow-none">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{language === 'hi' ? 'सत्र सारांश' : 'Session Summary'}</h4>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSummarize} disabled={isSummarizing}>
                                        {isSummarizing ? <span className="animate-spin text-xs">⏳</span> : <Sparkles className="h-3 w-3" />}
                                    </Button>
                                </div>
                                <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {summary ? summary : (
                                        <div className="flex flex-col gap-2 items-center justify-center py-4 text-muted-foreground/50">
                                            <p>{language === 'hi' ? "सारांश देखने के लिए क्लिक करें" : "Click to generate summary"}</p>
                                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleSummarize} disabled={isSummarizing}>
                                                {isSummarizing ? (language === 'hi' ? 'सारांश...' : 'Summarizing...') : (language === 'hi' ? 'सारांश' : 'Summarize')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Share with Therapist */}
                        {sessionId && (
                            <Card className="p-4 bg-background/50 border-border/60 shadow-none">
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">🔐 {language === 'hi' ? 'डेटा स्वामित्व' : 'Data Ownership'}</h4>
                                <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                                    {language === 'hi'
                                        ? 'आपका चैट डेटा आपका है। एन्क्रिप्ट करें और अपने थेरेपिस्ट के साथ सुरक्षित रूप से साझा करें।'
                                        : 'Your chat data belongs to you. Encrypt and securely share with your therapist.'}
                                </p>
                                <ShareAccessDialog sessionId={sessionId} language={language} />
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
