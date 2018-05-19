import { Injectable } from '@angular/core';

import { CharacterService } from '../character/character.service';
import { LevelService } from '../level/level.service';
import { TerrainService } from '../terrain/terrain.service';

@Injectable({
  providedIn: 'root'
})
export class MainScene extends Phaser.Scene {
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
    // this.levelService.generate(this);

    const human = this.characterService.generate('human', {}, this);
    human.setPosition(
      4 * this.terrainService.tileWidth + this.terrainService.tileWidth / 2,
      1 * this.terrainService.tileHeight + this.terrainService.tileWidth / 2
    );
    human.play('idle');
    // level.sys.displayList.add(human);
    // level.sys.updateList.add(human);
    this.scene.bringToTop('Main');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);
  }
}
