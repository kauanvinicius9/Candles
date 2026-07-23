import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SpeechService {
    private synthesis = window.speechSynthesis;

    speak(text: string): void {
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = 'pt-BR';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synthesis.speak(utterance);
    }

    stop(): void {
        this.synthesis.cancel()
    }

    pause(): void {
        this.synthesis.pause()
    }

    resume(): void {
        this.synthesis.resume()
    }
}