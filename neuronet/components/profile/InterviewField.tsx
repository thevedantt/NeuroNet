"use client"

import * as React from "react"
import { Mic, MicOff, Volume2, StopCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
// We'll assume these simple hooks exist or we'll inline basic logic if complex dependencies are missing. 
// For this task, we will implementation a self-contained simple speech hook logic or rely on browser APIs directly to ensure it works without complex setup.

interface InterviewFieldProps {
    label: string
    value: string
    onChange: (val: string) => void
    prompt: {
        en: string
        hi: string
        mr: string
    }
    language?: 'en' | 'hi' | 'mr'
    placeholder?: string
    metadata?: {
        inputMethod?: 'typed' | 'voice'
        language?: string
    }
    onMetadataChange?: (meta: { inputMethod: 'typed' | 'voice', language: string }) => void
}

export function InterviewField({
    label,
    value,
    onChange,
    prompt,
    language = 'en',
    placeholder,
    onMetadataChange
}: InterviewFieldProps) {
    const [isListening, setIsListening] = React.useState(false)
    const [isSpeaking, setIsSpeaking] = React.useState(false)
    const [recognition, setRecognition] = React.useState<any>(null)
    const synthRef = React.useRef<SpeechSynthesis | null>(null)
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

    // Initialize Speech Engines on Mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            // STT
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const reco = new SpeechRecognition()
                reco.continuous = false
                reco.interimResults = true // Show partials
                reco.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US'

                reco.onstart = () => setIsListening(true)
                reco.onend = () => setIsListening(false)
                reco.onerror = (e: any) => {
                    console.error("Speech error", e);
                    setIsListening(false)
                }

                reco.onresult = (event: any) => {
                    let finalTranscript = ''
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript
                        }
                    }
                    if (finalTranscript) {
                        // Append to existing text or replace? 
                        // Let's append if there is existing text, but maybe smart spacing.
                        const newValue = value ? `${value} ${finalTranscript}` : finalTranscript
                        onChange(newValue)
                        if (onMetadataChange) {
                            onMetadataChange({ inputMethod: 'voice', language })
                        }
                    }
                }
                setRecognition(reco)
            }

            // TTS
            if ('speechSynthesis' in window) {
                synthRef.current = window.speechSynthesis
            }
        }
    }, [language, value, onChange, onMetadataChange])

    // Update lang if changed
    React.useEffect(() => {
        if (recognition) {
            recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US'
        }
    }, [language, recognition])

    const handleSpeakPrompt = () => {
        if (!synthRef.current) return

        if (isSpeaking) {
            synthRef.current.cancel()
            setIsSpeaking(false)
            return
        }

        const textToSpeak = prompt[language] || prompt['en']
        const u = new SpeechSynthesisUtterance(textToSpeak)
        u.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US'
        u.onend = () => setIsSpeaking(false)

        utteranceRef.current = u
        synthRef.current.speak(u)
        setIsSpeaking(true)
    }

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition not supported in this browser.")
            return
        }

        if (isListening) {
            recognition.stop()
        } else {
            // Cancel TTS if speaking
            if (isSpeaking && synthRef.current) {
                synthRef.current.cancel()
                setIsSpeaking(false)
            }
            recognition.start()
        }
    }

    return (
        <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50 transition-all hover:bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <Label className="text-base font-semibold text-foreground/90">
                    {language === 'hi' ? 'प्रश्न:' : language === 'mr' ? 'प्रश्न:' : 'Q:'} {prompt[language]}
                </Label>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 rounded-full", isSpeaking && "text-primary bg-primary/10 animate-pulse")}
                        onClick={handleSpeakPrompt}
                        title="Listen to question"
                    >
                        {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant={isListening ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "h-8 gap-2 rounded-full transition-all duration-300",
                            isListening ? "bg-red-500 hover:bg-red-600 text-white border-none animate-pulse shadow-md" : "border-primary/20 hover:border-primary/50 text-foreground"
                        )}
                        onClick={toggleListening}
                    >
                        {isListening ? (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                {language === 'hi' ? 'सुन रहा है...' : language === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
                            </>
                        ) : (
                            <>
                                <Mic className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{language === 'hi' ? 'बोलकर उत्तर दें' : language === 'mr' ? 'बोलून उत्तर द्या' : 'Answer by Voice'}</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Textarea
                placeholder={placeholder || (language === 'hi' ? "यहाँ टाइप करें..." : "Type your answer here...")}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                    if (onMetadataChange) onMetadataChange({ inputMethod: 'typed', language })
                }}
                className={cn(
                    "min-h-[100px] resize-y bg-background/50 focus:bg-background transition-all",
                    isListening && "border-red-400 ring-1 ring-red-400/20"
                )}
            />

            {value && (
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-muted-foreground hover:text-destructive"
                        onClick={() => onChange("")}
                    >
                        <RefreshCcw className="h-3 w-3 mr-1" /> Clear
                    </Button>
                </div>
            )}
        </div>
    )
}
