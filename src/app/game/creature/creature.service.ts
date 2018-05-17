import { Injectable } from '@angular/core';

import { dwarf } from './dwarf';
import { elf } from './elf';
import { halfling } from './halfling';
import { human } from './human';

@Injectable({
  providedIn: 'root'
})
export class CreatureService {
  private readonly pixelWidth = 2;

  private readonly pixelHeight = 2;

  private creaturesIndex = { elf, dwarf, halfling, human };

  public constructor() { }

  public get(creatureKey: string): any {
    return this.creaturesIndex[creatureKey];
  }

  public loadBaseRenderables(scene: Phaser.Scene): void {
    Object.keys(this.creaturesIndex).forEach(creatureKey => {
      const creature = this.get(creatureKey);
      this.loadTextures(scene, creature.textures);
      this.loadAnimations(scene, creature.animations);
    });
  }

  private loadTextures(scene: Phaser.Scene, textures: any[]): void {
    textures.forEach(
      texture => scene.textures.generate(texture.key, { data: texture.data, pixelWidth: this.pixelWidth, pixelHeight: this.pixelHeight })
    );
  }

  private loadAnimations(scene: Phaser.Scene, animations: any[]): void {
    animations.forEach(animation => scene.anims.create(animation));
  }
}
