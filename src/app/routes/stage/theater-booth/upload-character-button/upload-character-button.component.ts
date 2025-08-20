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
import { CharacterCardImportService } from '../../../../core/services/character-card-import.service';
import { CharacterBoothModel } from '../../../../shared/models/character-booth.model';

@Component({
  selector: 'tk-upload-character-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-character-button.component.html',
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
