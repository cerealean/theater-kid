import { Injectable, signal } from '@angular/core';
import { CharacterBoothModel } from '../shared/models/character-booth.model';

@Injectable({ providedIn: 'root' })
export class BoothStore {
  readonly activeCharacter = signal<CharacterBoothModel | null>(null);
  setActiveCharacter = (c: CharacterBoothModel) => this.activeCharacter.set(c);
  clear = () => this.activeCharacter.set(null);
}
