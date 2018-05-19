import { Injectable } from '@angular/core';
import GenerateTexture from 'phaser/src/create/GenerateTexture';

import { TextureService } from '../texture/texture.service';
import { CreatureDefinitions } from './creature-definitions';
import { dwarf } from './dwarf';
import { elf } from './elf';
import { halfling } from './halfling';
import { human } from './human';

@Injectable({
  providedIn: 'root'
})
export class CreatureService {
  private readonly pixelWidth = CreatureDefinitions.pixelWidth;

  private readonly pixelHeight = CreatureDefinitions.pixelHeight;

  private creaturesIndex = { elf, dwarf, halfling, human };

  public constructor(private textureService: TextureService) { }

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
      texture => scene.textures.addCanvas(
        texture.key,
        this.textureService.generate(texture.data, this.pixelWidth, this.pixelHeight, texture.shadowColor)
      )
    );
  }

  private loadAnimations(scene: Phaser.Scene, animations: any[]): void {
    animations.forEach(animation => scene.anims.create(animation));
  }
}
