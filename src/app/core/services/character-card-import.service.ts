import { Injectable } from '@angular/core';
import { CharacterBoothModel } from '../../shared/models/character-booth.model';
import { parseCharacterFile } from '../../shared/utils/png-tavern-parser';

@Injectable({ providedIn: 'root' })
export class CharacterCardImportService {
  async import(file: File): Promise<CharacterBoothModel> {
    return parseCharacterFile(file);
  }
}
