import { SpeechEngine, SpeechEngineConfig, SpeechState } from "./speechEngine";

/**
 * Browser-native Web Speech API implementation.
 * Prioritizes low latency and Hindi support.
 */
export class BrowserSpeechEngine implements SpeechEngine {
    private recognition: SpeechRecognition | null = null;
    private config: SpeechEngineConfig;
    private isListening = false;
    private shouldBeListening = false; // Tracks user intent (vs browser auto-stop)
    private processingTimer: NodeJS.Timeout | null = null;

    constructor(config: SpeechEngineConfig) {
        this.config = config;

        if (this.isSupported()) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.configureRecognition();
        } else {
            this.config.onStateChange('not-supported');
        }
    }

    private configureRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = true; // Keep listening until user stops
        this.recognition.interimResults = true; // Instant feedback
        this.recognition.lang = this.config.language;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.config.onStateChange('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.processingTimer) clearTimeout(this.processingTimer);

            // If the user hasn't explicitly stopped, auto-restart
            // (browser can stop recognition due to silence, network, etc.)
            if (this.shouldBeListening && this.recognition) {
                try {
                    this.recognition.start();
                    return; // Don't change state, seamless restart
                } catch (e) {
                    console.warn("Failed to auto-restart recognition", e);
                }
            }

            this.shouldBeListening = false;
            this.config.onStateChange('idle');
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            // Cancel any "no speech" timers if we get results
            if (this.processingTimer) clearTimeout(this.processingTimer);
            this.processingTimer = setTimeout(() => {
                // If we stop getting results for a bit, consider processing done
            }, 500); // 500ms silence buffer if needed

            // In continuous mode, event.results accumulates ALL results
            // Collect all finalized text + current interim for full transcript
            let fullTranscript = '';
            let currentInterim = '';

            for (let i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    fullTranscript += event.results[i][0].transcript;
                } else {
                    currentInterim += event.results[i][0].transcript;
                }
            }

            // Send the complete text (all finalized + current interim)
            const textToShow = fullTranscript + currentInterim;
            if (textToShow) {
                this.config.onTranscript(textToShow, !currentInterim);
            }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            this.isListening = false;
            if (event.error === 'no-speech') {
                // Silence timeout — don't change state, let onend handle auto-restart
                return;
            } else if (event.error === 'aborted') {
                // Intentional abort, just let onend clean up
                return;
            } else if (event.error === 'not-allowed') {
                this.shouldBeListening = false;
                this.config.onError('Microphone access denied');
                this.config.onStateChange('error');
            } else {
                this.shouldBeListening = false;
                console.warn("Speech recognition error", event.error);
                this.config.onStateChange('error');
            }
        };
    }

    start(): void {
        if (!this.recognition) return;
        if (this.isListening) {
            this.stop();
            return;
        }

        this.shouldBeListening = true;
        try {
            this.recognition.start();
        } catch (e) {
            console.error("Failed to start recognition", e);
            this.shouldBeListening = false;
            this.config.onStateChange('error');
        }
    }

    stop(): void {
        if (!this.recognition) return;
        this.shouldBeListening = false;
        this.recognition.stop();
    }

    abort(): void {
        if (!this.recognition) return;
        this.shouldBeListening = false;
        this.recognition.abort();
    }

    isSupported(): boolean {
        return typeof window !== 'undefined' &&
            (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
    }
}
