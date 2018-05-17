import { Injectable } from '@angular/core';

import { CreatureService } from '../creature/creature.service';
import { Character } from './character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public constructor(private creatureService: CreatureService) { }

  public generate(creatureKey: string, classConfig: any, scene: Phaser.Scene): Character {
    return new Character(this.creatureService.get(creatureKey), classConfig, scene, new Phaser.Curves.Path(), 0, 0);
  }
}
