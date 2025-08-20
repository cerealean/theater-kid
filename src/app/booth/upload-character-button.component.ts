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
      class="tk-btn group relative overflow-hidden"
      [attr.title]="busy() ? 'Parsing character file...' : 'Upload Character PNG/JSON'"
    >
      <div class="flex items-center gap-2">
        <!-- Upload SVG Icon -->
        <svg
          class="w-5 h-5 transition-transform group-hover:scale-110"
          [class.animate-pulse]="busy()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <span class="text-sm">{{ busy() ? 'Parsing…' : 'Upload' }}</span>
      </div>
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
      this.error.set(
        (e as Error)?.message ??
          'Unable to parse character file. Please check the file format and try again.',
      );
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }
}
