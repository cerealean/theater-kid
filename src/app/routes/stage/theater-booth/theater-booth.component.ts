import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'tk-theater-booth',
  imports: [CommonModule],
  templateUrl: './theater-booth.component.html',
})
export class TheaterBoothComponent {
  // Input properties for character information
  currentCharacter = input<string>('');
  characterRole = input<string>('');
  sceneContext = input<string>('');
  characterTraits = input<string[]>([]);
  performanceNotes = input<string>('');

  // Event outputs for ambiance controls
  toggleSpotlight = output<void>();
  toggleCurtains = output<void>();
  toggleMusic = output<void>();
  triggerApplause = output<void>();
  resetCharacter = output<void>();

  // Event handlers
  onToggleSpotlight(): void {
    this.toggleSpotlight.emit();
  }

  onToggleCurtains(): void {
    this.toggleCurtains.emit();
  }

  onToggleMusic(): void {
    this.toggleMusic.emit();
  }

  onTriggerApplause(): void {
    this.triggerApplause.emit();
  }

  onResetCharacter(): void {
    this.resetCharacter.emit();
  }
}
