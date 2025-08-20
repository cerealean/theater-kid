import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../core/services/config.service';

@Component({
  standalone: true,
  selector: 'tk-backstage',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-screen-md mx-auto p-6 space-y-6">
      <h1 class="text-xl font-semibold">Backstage</h1>
      <p class="opacity-80">Role editor & settings.</p>

      <!-- Developer Settings Section -->
      <section class="mt-8 border-t border-opacity-20 border-white pt-6">
        <h3 class="text-sm font-semibold uppercase tracking-wide opacity-70 mb-4">Developer</h3>

        <div class="space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              [checked]="config.debugFake()"
              (change)="onToggleFakeProvider($event)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div>
              <span class="text-sm font-medium">Use Fake Streaming Provider</span>
              <p class="text-xs opacity-60 mt-1">
                Enable debug mode with simulated AI responses. No API keys or network calls
                required.
              </p>
            </div>
          </label>

          <div class="text-xs opacity-50 mt-2">
            <p>💡 You can also enable this by adding <code>?debugFake=1</code> to the URL</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BackstageComponent {
  config = inject(ConfigService);

  onToggleFakeProvider(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.config.setDebugFake(target.checked);
  }
}
