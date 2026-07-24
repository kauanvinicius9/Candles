import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from './core/services/accessibility.service';
 
@Component({
  selector: 'app-accessibility-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-bar.component.html',
  styleUrls: ['./accessibility-bar.component.scss']
})

export class AccessibilityBarComponent {
  public isHighContrast: boolean = false;
  public isSpeechActive: boolean = false;

  constructor(private accessibilityService: AccessibilityService) {}

  public onIncreaseFont(): void {
    this.accessibilityService.changeFontSize(10);
  }

  public onDecreaseFont(): void {
    this.accessibilityService.changeFontSize(-10);
  }

  public onToggleContrast(): void {
    this.isHighContrast = this.accessibilityService.toggleHighContrast();
  }

  public onToggleSpeech(): void {
    this.isSpeechActive = this.accessibilityService.toggleTextToSpeech();
  }
}