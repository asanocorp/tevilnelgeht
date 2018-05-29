import { ClassConfig } from '../class/class-config';
import { CreatureConfig } from '../creature/creature-config';
import { ItemConfig } from '../item/item-config';

import { CharacterData } from './character-manager';

export class Character extends Phaser.GameObjects.PathFollower {
  public readonly inventory: ItemConfig[] = [];

  public readonly itemEquipSlots = [];

  public animationsKeyMap;

  public texturesKeyMap;

  public defaultTexture = '';

  public defaultAnimation = '';

  public attachment: CharacterData;

  public constructor(
    public creatureConfig: CreatureConfig,
    public classConfig: ClassConfig,
    scene: Phaser.Scene,
    path: Phaser.Curves.Path,
    x: number,
    y: number,
  ) {
    super(scene, path, x, y, creatureConfig.defaultTexture);

    this.animationsKeyMap = { ...creatureConfig.animationsKeyMap };
    this.texturesKeyMap = { ...creatureConfig.texturesKeyMap };
    this.defaultTexture = creatureConfig.defaultTexture;
    this.defaultAnimation = creatureConfig.defaultAnimation;
  }

  public act(cost: (c) => void): Promise<void> {
    return new Promise((unlock: () => void) => this.emit('turn', this, cost, unlock));
  }

  public play(key: string, ignoreIfPlaying = false, startFrame = 0): Character {
    if (!this.creatureConfig.animationKeys.includes(key)) {
      this.scene.anims.play(this.defaultAnimation, this);
      return this;
    }

    return super.play(this.animationsKeyMap[key], ignoreIfPlaying, startFrame) as Character;
  }
}
