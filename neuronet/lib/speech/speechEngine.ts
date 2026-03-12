export type SpeechState = 'idle' | 'listening' | 'processing' | 'error' | 'not-supported';

export interface SpeechEngineConfig {
    language: 'hi-IN' | 'en-US' | 'mr-IN';
    onTranscript: (text: string, isFinal: boolean) => void;
    onStateChange: (state: SpeechState) => void;
    onError: (error: string) => void;
}

export interface SpeechEngine {
    start(): void;
    stop(): void;
    abort(): void;
    isSupported(): boolean;
}
