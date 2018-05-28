import { Injectable } from '@angular/core';
import GenerateTexture from 'phaser/src/create/GenerateTexture';

import { TextureService } from '../texture/texture.service';
import { CreatureConfig } from './creature-config';
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

  public readonly CreatureAnimation = CreatureDefinitions.CreatureAnimation;

  public readonly CreatureAbility = CreatureDefinitions.CreatureAbility;

  public readonly CreatureAbilityBoundType = CreatureDefinitions.CreatureAbilityBoundType;

  public constructor(private textureService: TextureService) { }

  public get(creatureId: string): CreatureConfig {
    return creatures[creatureId];
  }

  public getPlayable(): CreatureConfig[] {
    return CreatureDefinitions.playableCreatureIds.map(id => this.get(id));
  }

  public getPlayerAbilityDice(): string {
    return CreatureDefinitions.defaultValuesByCreatureType[CreatureDefinitions.CreatureType.Humanoid].abilityDice;
  }

  public getAbilities(): string[] {
    return Object.keys(CreatureDefinitions.CreatureAbility)
      .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); });
  }

  public loadBaseRenderables(scene: Phaser.Scene): void {
    Object.keys(creatures).forEach(creatureKey => {
      const creature = this.get(creatureKey);
      this.textureService.loadTextures(scene, creature.textures, this.pixelWidth, this.pixelHeight);
      this.textureService.loadAnimations(scene, creature.animations);
    });
  }
}
