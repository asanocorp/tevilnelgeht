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

  public generate(creatureId: string, classConfig: ClassConfig, scene: Phaser.Scene): Character {
    const creatureConfig = this.creatureService.get(creatureId);

    classConfig = { ...this.classService.get(classConfig.classId), ...classConfig };

    const character = new Character(creatureConfig, classConfig, scene, new Phaser.Curves.Path(), 0, 0);
    this.buildRenderables(character, scene);

    return character;
  }

  public buildRenderables(character: Character, scene: Phaser.Scene): void {
    const equippedItems = {
      legs: undefined,
      feet: this.itemService.getEquippableItemGroup('feet').boots,
      torso: undefined,
      arms: undefined,
      hands: undefined,
      fingers: undefined,
      shoulders: undefined,
      neck: undefined,
      head: undefined
    };

    let keyPrefix = '';
    Object.keys(equippedItems).forEach(slot => {
      if (equippedItems[slot] !== undefined) {
        keyPrefix = keyPrefix.concat(equippedItems[slot].key, '-');
      }
    });

    const characterTextures = character.creatureConfig.textures.map(texture => {
      let data = this.copyFrame(texture.data);

      Object.keys(equippedItems).forEach(itemGroupKey => {
        switch (itemGroupKey) {
          case 'feet':
            data = this.itemService.getEquippableItemGroup(itemGroupKey).equipped(equippedItems[itemGroupKey], data, texture.sockets);
            break;
          default:
            break;
        }
      });

      return { ...texture, data, key: keyPrefix + texture.key };
    });

    const characterAnimations = character.creatureConfig.animations.map(animation => {
      const frames = animation.frames.map(frame => ({ key: keyPrefix + frame.key }));
      return { ...animation, frames, key: keyPrefix + animation.key };
    });

    const characterDefaultTexture = keyPrefix + character.creatureConfig.defaultTexture;

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

    this.loadTextures(scene, characterTextures);
    this.loadAnimations(scene, characterAnimations);
  }

  private copyFrame(frame: string[]): string[] {
    return frame.map(row => row.slice());
  }

  private loadTextures(scene: Phaser.Scene, textures: any[]): void {
    textures.forEach(
      texture => scene.textures.addCanvas(
        texture.key,
        this.textureService.generate(texture.data, this.creatureService.pixelWidth, this.creatureService.pixelHeight, texture.shadowColor)
      )
    );
  }

  private loadAnimations(scene: Phaser.Scene, animations: any[]): void {
    animations.forEach(animation => scene.anims.create(animation));
  }
}
