import { computed, Injectable, signal } from '@angular/core';
import { type CharacterBoothModel } from '../../shared/models/character-booth.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly characters = new Map<string, CharacterBoothModel>();
  private readonly _currentCharacter = signal<string>('');

  public readonly currentCharacter = computed(() => this.characters.get(this._currentCharacter()));

  public setCurrentCharacter(name: string): void {
    if (this.characters.has(name)) {
      this._currentCharacter.set(name);
    }
  }

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
      this.setCurrentCharacterIfFirstCharacter(nameOrCharacter);
    } else {
      this.characters.set(nameOrCharacter.name, nameOrCharacter);
      this.setCurrentCharacterIfFirstCharacter(nameOrCharacter.name);
    }
  }

  removeCharacter(character: string): void;
  removeCharacter(character: CharacterBoothModel): void;
  removeCharacter(character: string | CharacterBoothModel): void {
    if (typeof character === 'string') {
      this.removeCharacterAndUnsetIfCurrentCharacter(character);
    } else {
      this.removeCharacterAndUnsetIfCurrentCharacter(character.name);
    }
  }

  private setCurrentCharacterIfFirstCharacter(character: string): void {
    if (this.characters.size === 1) {
      this._currentCharacter.set(character);
    }
  }

  private removeCharacterAndUnsetIfCurrentCharacter(name: string): void {
    this.characters.delete(name);
    if (this._currentCharacter() === name) {
      this._currentCharacter.set('');
    }
  }
}
