"use client"

import * as React from "react"
import { SpeechState, SpeechEngine } from "@/lib/speech/speechEngine"
import { BrowserSpeechEngine } from "@/lib/speech/browserEngine"

interface UseSpeechToTextProps {
    language?: 'hi-IN' | 'en-US' | 'mr-IN'
    onTranscript?: (text: string) => void
}

export function useSpeechToText({ language = 'hi-IN', onTranscript }: UseSpeechToTextProps = {}) {
    const [state, setState] = React.useState<SpeechState>('idle')
    const [transcript, setTranscript] = React.useState("")
    const [isSupported, setIsSupported] = React.useState(true)

    // Engine Ref
    const engineRef = React.useRef<SpeechEngine | null>(null)

    React.useEffect(() => {
        // Initialize Engine
        const engine = new BrowserSpeechEngine({
            language,
            onTranscript: (text, isFinal) => {
                setTranscript(text)
                if (onTranscript) onTranscript(text)
            },
            onStateChange: (newState) => {
                setState(newState)
                if (newState === 'not-supported') setIsSupported(false)
            },
            onError: (err) => {
                console.warn("STT Error:", err)
                setState('error')
            }
        })

        if (!engine.isSupported()) {
            setIsSupported(false)
            setState('not-supported')
        }

        engineRef.current = engine

        return () => {
            if (engineRef.current) engineRef.current.abort()
        }
    }, [language])

    const startListening = React.useCallback(() => {
        if (engineRef.current) {
            setTranscript("") // Clear previous
            engineRef.current.start()
        }
    }, [])

    const stopListening = React.useCallback(() => {
        if (engineRef.current) engineRef.current.stop()
    }, [])

    const resetState = React.useCallback(() => {
        if (engineRef.current) engineRef.current.abort()
        setState('idle')
        setTranscript("")
    }, [])

    return {
        state,
        transcript,
        startListening,
        stopListening,
        resetState,
        isSupported
    }
}
