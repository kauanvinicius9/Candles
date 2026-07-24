import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AccessibilityService {
  private currentFontScale: number = 100;
  private isHighContrastActive: boolean = false;
  private isTextToSpeechActive: boolean = false;
  private lastSpokenText: string = '';

  constructor() {
    this.initHoverTextToSpeech();
  }

  public changeFontSize(deltaPercent: number): void {
    this.currentFontScale += deltaPercent;

    if (this.currentFontScale < 80) this.currentFontScale = 80;
    if (this.currentFontScale > 150) this.currentFontScale = 150;

    document.body.style.fontSize = `${this.currentFontScale}%`;
  }

  public toggleHighContrast(): boolean {
    this.isHighContrastActive = !this.isHighContrastActive;

    if (this.isHighContrastActive) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    return this.isHighContrastActive;
  }

  public toggleTextToSpeech(): boolean {
    this.isTextToSpeechActive = !this.isTextToSpeechActive;

    if (!this.isTextToSpeechActive && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.lastSpokenText = '';
    }

    return this.isTextToSpeechActive;
  }

  private initHoverTextToSpeech(): void {
    if (!('speechSynthesis' in window)) return;

    document.addEventListener('mouseover', (event: MouseEvent) => {
      if (!this.isTextToSpeechActive) return;

      const target = event.target as HTMLElement;
      const supportedTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'LI'];

      if (target && supportedTags.includes(target.tagName)) {
        const textToRead = target.innerText?.trim();

        if (textToRead && textToRead.length > 0 && textToRead !== this.lastSpokenText) {
          this.lastSpokenText = textToRead;
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = 'pt-BR';
          utterance.rate = 1.0;
          utterance.onend = () => {
            this.lastSpokenText = '';
          };

          window.speechSynthesis.speak(utterance);
        }
      }
    });
  }
}