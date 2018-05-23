import { Injectable } from '@angular/core';

import { Character } from '../character/character';
import { CharacterService } from '../character/character.service';
import { LevelService } from '../level/level.service';

@Injectable({
  providedIn: 'root'
})
export class MainScene extends Phaser.Scene {
  private playerCharacter: Character;

  public constructor(private characterService: CharacterService, private levelService: LevelService) {
    super({ key: 'Main' });
  }

  public create(): void {
    const level = this.levelService.load('dungeon');
    this.scene.add(level.sys.settings.key, level, false);
    this.scene.launch(level.sys.settings.key);

    this.playerCharacter = this.characterService.generate('human', { classId: 'fighter', level: 1 }, this);

    level.attachPlayerCharacter(this.playerCharacter);

    // Attach player sprite input listeners...

    // Required so player sprite remains interactive when attached to a level.
    this.scene.bringToTop('Main');
  }
}
