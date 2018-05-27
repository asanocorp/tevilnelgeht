import { Injectable } from '@angular/core';
import GenerateTexture from 'phaser/src/create/GenerateTexture';

import { TextureService } from '../texture/texture.service';
import { CreatureDefinitions } from './creature-definitions';
import { creatures } from './creatures';

@Injectable({
  providedIn: 'root'
})
export class CreatureService {

  public readonly pixelWidth = CreatureDefinitions.pixelWidth;

  public readonly pixelHeight = CreatureDefinitions.pixelHeight;

  public readonly CreatureId = CreatureDefinitions.CreatureId;

  public readonly CreatureType = CreatureDefinitions.CreatureType;

  public readonly CreatureEquipmentSlot = CreatureDefinitions.CreatureEquipmentSlot;

  public readonly CreatureAnimation = CreatureDefinitions.CreatureAnimation;

  public constructor(private textureService: TextureService) { }

  public get(creatureId: string): any {
    return creatures[creatureId];
  }

  public getPlayable(): any[] {
    return CreatureDefinitions.playableCreatureIds.map(id => this.get(id));
  }

  public loadBaseRenderables(scene: Phaser.Scene): void {
    Object.keys(creatures).forEach(creatureKey => {
      const creature = this.get(creatureKey);
      this.textureService.loadTextures(scene, creature.textures, this.pixelWidth, this.pixelHeight);
      this.textureService.loadAnimations(scene, creature.animations);
    });
  }
}
