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

    const footwear = this.itemService.getEquippableItemGroup('footwear');

    const characterTextures = creatureConfig.textures.map(texture => {
      const data = footwear.equipped(footwear.boots, this.copyFrame(texture.data), texture.sockets);
      const key = 'boots-' + texture.key;

      return { ...texture, data, key };
    });

    const characterAnimations = creatureConfig.animations.map(animation => {
      const frames = animation.frames.map(frame => ({ key: 'boots-' + frame.key }));

      return { ...animation, frames, key: 'boots-' + animation.key };
    });

    const characterDefaultTexture = 'boots-' + creatureConfig.defaultTexture;

    const characterTexturesKeyMap = {};
    Object.keys(creatureConfig.texturesKeyMap).forEach(key => characterTexturesKeyMap[key] = 'boots-' + creatureConfig.texturesKeyMap[key]);

    const characterAnimationsKeyMap = {};
    Object.keys(creatureConfig.animationsKeyMap).forEach(
      key => characterAnimationsKeyMap[key] = 'boots-' + creatureConfig.animationsKeyMap[key]
    );

    this.loadTextures(scene, characterTextures);
    this.loadAnimations(scene, characterAnimations);

    return new Character(creatureConfig, classConfig, scene, new Phaser.Curves.Path(), 0, 0);
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
