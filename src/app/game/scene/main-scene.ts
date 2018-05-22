import { Injectable } from '@angular/core';

import { Character } from '../character/character';
import { CharacterService } from '../character/character.service';
import { LevelService } from '../level/level.service';
import { TerrainService } from '../terrain/terrain.service';

@Injectable({
  providedIn: 'root'
})
export class MainScene extends Phaser.Scene {
  private playerCharacter: Character;

  public constructor(
    private characterService: CharacterService,
    private levelService: LevelService,
    private terrainService: TerrainService
  ) {
    super({ key: 'Main' });
  }

  public create(): void {
    const level = this.levelService.load('somelevel');
    this.scene.add(level.sys.settings.key, level, false);
    this.scene.launch(level.sys.settings.key);

    this.playerCharacter = this.characterService.generate('human', {}, this);
    // this.playerCharacter.on('pointerover', () => this.playerCharacter.setTint(0xff0000));
    // this.playerCharacter.on('pointerout', () => this.playerCharacter.clearTint());
    // this.playerCharacter.on('pointermove', () => this.playerCharacter.setAlpha(0.5, 1, 1, 0.5));

    level.attachPlayerCharacter(this.playerCharacter);
    this.scene.bringToTop('Main');
  }
}
