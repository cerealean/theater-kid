import { computed, Injectable, signal } from '@angular/core';
import { CharacterBoothModel } from '../../shared/models/character-booth.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly characters = new Map<string, CharacterBoothModel>();
  private readonly _currentCharacter = signal<string>('');

  public readonly currentCharacter = computed(() => this.characters.get(this._currentCharacter()));

  public getCharacter(name: string): CharacterBoothModel | undefined {
    return this.characters.get(name);
  }

  public getCharacters(): readonly CharacterBoothModel[] {
    return Array.from(this.characters.values());
  }

  addCharacter(character: CharacterBoothModel): void;
  addCharacter(name: string, character: CharacterBoothModel): void;
  addCharacter(
    nameOrCharacter: string | CharacterBoothModel,
    character?: CharacterBoothModel,
  ): void {
    if (typeof nameOrCharacter === 'string') {
      this.characters.set(nameOrCharacter, character!);
    } else {
      this.characters.set(nameOrCharacter.name, nameOrCharacter);
    }
  }

  removeCharacter(character: string): void;
  removeCharacter(character: CharacterBoothModel): void;
  removeCharacter(character: string | CharacterBoothModel): void {
    if (typeof character === 'string') {
      this.characters.delete(character);
    } else {
      this.characters.delete(character.name);
    }
  }
}
