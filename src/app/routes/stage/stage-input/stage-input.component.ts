import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'tk-stage-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './stage-input.component.html',
})
export class StageInputComponent {
  // Input properties
  busy = input<boolean>(false);

  // Two-way binding for input values
  inputValue = model<string>('');
  systemValue = model<string>('');

  // Events
  send = output<void>();
  enterKey = output<KeyboardEvent>();

  onSend(): void {
    this.send.emit();
  }

  onEnterKey(event: KeyboardEvent): void {
    this.enterKey.emit(event);
  }
}
