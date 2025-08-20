import {
  Component,
  EventEmitter,
  Output,
  signal,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCardImportService } from '../core/services/character-card-import.service';
import { CharacterBoothModel } from '../shared/models/character-booth.model';

@Component({
  selector: 'tk-upload-character-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="fileInput.nativeElement.click()"
      [attr.aria-busy]="busy()"
      [disabled]="busy()"
      class="btn"
    >
      {{ busy() ? 'Parsing…' : 'Upload Character PNG/JSON' }}
    </button>
    <input
      #file
      type="file"
      accept=".png,application/json,.json"
      hidden
      (change)="onFile($event)"
    />
    <p *ngIf="error()" role="alert" class="text-red-500 mt-2">{{ error() }}</p>
  `,
})
export class UploadCharacterButtonComponent {
  private svc = inject(CharacterCardImportService);
  @Output() loaded = new EventEmitter<CharacterBoothModel>();
  @ViewChild('file', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const character = await this.svc.import(file);
      this.loaded.emit(character);
    } catch (e) {
      this.error.set((e as Error)?.message ?? 'Failed to parse character.');
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }
}
