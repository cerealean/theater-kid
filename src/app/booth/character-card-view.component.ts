import { Component, computed, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { BoothStore } from './booth.store';

@Component({
  selector: 'tk-character-card-view',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <section *ngIf="active()" class="mt-4 space-y-4">
      <div class="flex items-center gap-3">
        <img [src]="active()!.avatarUrl" alt="" class="h-12 w-12 rounded" />
        <h2 class="text-xl font-semibold">{{ active()!.name }}</h2>
      </div>

      <div *ngIf="active()!.tags?.length" class="flex flex-wrap gap-2">
        <span *ngFor="let t of active()!.tags" class="px-2 py-1 rounded border text-xs">{{
          t
        }}</span>
      </div>

      <p class="opacity-80">{{ active()!.description }}</p>

      <details class="border rounded p-3">
        <summary class="cursor-pointer font-medium">Prompts</summary>
        <div class="mt-2">
          <div *ngIf="active()!.systemPrompt">
            <h4 class="font-semibold">System</h4>
            <pre class="whitespace-pre-wrap">{{ active()!.systemPrompt }}</pre>
          </div>
          <div *ngIf="active()!.postHistory">
            <h4 class="font-semibold mt-3">Post-history</h4>
            <pre class="whitespace-pre-wrap">{{ active()!.postHistory }}</pre>
          </div>
          <div *ngIf="active()!.examples">
            <h4 class="font-semibold mt-3">Examples</h4>
            <pre class="whitespace-pre-wrap">{{ active()!.examples }}</pre>
          </div>
        </div>
      </details>
    </section>

    <p *ngIf="!active()" class="opacity-70">No character loaded yet.</p>
  `,
})
export class CharacterCardViewComponent {
  private booth = inject(BoothStore);
  readonly active = computed(() => this.booth.activeCharacter());
}
