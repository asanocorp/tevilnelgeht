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

    /*this.time.delayedCall(3500, () => {
      const path = new Phaser.Curves.Path();
      path.add(new (Phaser.Curves as any).Line([0, 0, 48, 0]));
      human.setPath(path);
      human.startFollow(1000);
      human.pathTween.setCallback('onStart', () => {
        human.play('walkRight');
      }, []);
      human.pathTween.setCallback('onComplete', () => {
        human.play('idle');
        this.time.delayedCall(3500, () => {
          human.startFollow(1000);
          human.pathTween.setCallback('onStart', () => {
            human.play('walkRight');
          }, []);
          human.pathTween.setCallback('onComplete', () => {
            human.play('idle');
          }, []);
        }, undefined, undefined);
      }, []);
    }, undefined, undefined);*/
  }
}
