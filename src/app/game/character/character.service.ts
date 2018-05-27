import { Injectable } from '@angular/core';

import { ClassService } from '../class/class.service';
import { ClassConfig } from '../class/class-config';
import { CreatureService } from '../creature/creature.service';
import { ItemService } from '../item/item.service';
import { TextureService } from '../texture/texture.service';
import { Character } from './character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public constructor(
    private textureService: TextureService,
    private creatureService: CreatureService,
    private classService: ClassService,
    private itemService: ItemService
  ) { }

  public generate(creatureId: string, classId: string, classLevel: number, inventoryConfig: any, scene: Phaser.Scene): Character {
    const creatureConfig = this.creatureService.get(creatureId);

    const classConfig = { ...this.classService.get(classId), level: classLevel };

    const character = new Character(creatureConfig, classConfig, scene, new Phaser.Curves.Path(), 0, 0);

    character.setOrigin(creatureConfig.textureOrigin.x, creatureConfig.textureOrigin.y);

    inventoryConfig.forEach(item => {
      if (item.equipped) {
        character.equipmentSlots[item.equipped] = this.itemService.getEquippableItemGroup(item.equipped)[item.key];
      } else {
        character.inventory.push(item);
      }
    });

    this.buildRenderables(character, scene);

    return character;
  }

  public buildRenderables(character: Character, scene: Phaser.Scene): void {
    const equippedItems = character.equipmentSlots;

    let keyPrefix = '';
    Object.keys(equippedItems).forEach(slot => {
      if (equippedItems[slot] !== undefined) {
        keyPrefix = keyPrefix.concat(equippedItems[slot].key, '-');
      }
    });

    if (!keyPrefix) {
      return;
    }

    const characterTextures = character.creatureConfig.textures.map(texture => {
      let data = this.copyTextureData(texture.data);

      Object.keys(equippedItems).forEach(itemGroupKey => {
        const item = equippedItems[itemGroupKey];

        if (item) {
          item.groupKey = itemGroupKey;
          data = this.itemService.getEquippableItemGroup(itemGroupKey).equipped(item, data, texture.sockets);
        }
      });

      return { ...texture, data, key: keyPrefix + texture.key };
    });

    const characterAnimations = character.creatureConfig.animations.map(animation => {
      const frames = animation.frames.map(frame => ({ key: keyPrefix + frame.key }));
      return { ...animation, frames, key: keyPrefix + animation.key };
    });

    const characterDefaultTexture = keyPrefix + character.creatureConfig.defaultTexture;
    const characterDefaultAnimation = keyPrefix + character.creatureConfig.defaultAnimation;

    const characterTexturesKeyMap = {};
    Object.keys(character.creatureConfig.texturesKeyMap).forEach(
      key => characterTexturesKeyMap[key] = keyPrefix + character.creatureConfig.texturesKeyMap[key]
    );

    const characterAnimationsKeyMap = {};
    Object.keys(character.creatureConfig.animationsKeyMap).forEach(
      key => characterAnimationsKeyMap[key] = keyPrefix + character.creatureConfig.animationsKeyMap[key]
    );

    character.texturesKeyMap = characterTexturesKeyMap;
    character.animationsKeyMap = characterAnimationsKeyMap;
    character.defaultTexture = characterDefaultTexture;
    character.defaultAnimation = characterDefaultAnimation;

    this.textureService.loadTextures(scene, characterTextures, this.creatureService.pixelHeight, this.creatureService.pixelWidth);
    this.textureService.loadAnimations(scene, characterAnimations);
  }

  private copyTextureData(data: string[]): string[] {
    return data.map(row => row.slice());
  }
}
