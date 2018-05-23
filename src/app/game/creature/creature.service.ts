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
  private creatureIndex = { elf, dwarf, halfling, human };

  public readonly pixelWidth = CreatureDefinitions.pixelWidth;

  public readonly pixelHeight = CreatureDefinitions.pixelHeight;

  public constructor(private textureService: TextureService) { }

  public get(creatureId: string): any {
    return this.creatureIndex[creatureId];
  }

  public loadBaseRenderables(scene: Phaser.Scene): void {
    Object.keys(this.creatureIndex).forEach(creatureKey => {
      const creature = this.get(creatureKey);
      this.textureService.loadTextures(scene, creature.textures, this.pixelWidth, this.pixelHeight);
      this.textureService.loadAnimations(scene, creature.animations);
    });
  }
}
