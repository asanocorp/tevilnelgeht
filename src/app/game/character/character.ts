import { CharacterData } from './character-manager';

export class Character extends Phaser.GameObjects.PathFollower {
  public animationsKeyMap = {};

  public texturesKeyMap = {};

  public defaultTexture = '';

  public attachment: CharacterData;

  public constructor(
    public creatureConfig: any,
    public classConfig: any,
    scene: Phaser.Scene,
    path: Phaser.Curves.Path,
    x: number,
    y: number,
  ) {
    super(scene, path, x, y, creatureConfig.defaultTexture);

    this.animationsKeyMap = { ...creatureConfig.animationsKeyMap };
    this.texturesKeyMap = { ...creatureConfig.texturesKeyMap };
    this.defaultTexture = creatureConfig.defaultTexture;

    this.setOrigin(creatureConfig.origin.x, creatureConfig.origin.y);
  }

  public act(cost: (c) => void): Promise<void> {
    return new Promise((unlock: () => void) => this.emit('turn', this, cost, unlock));
  }

  public play(key: string, ignoreIfPlaying = false, startFrame = 0): Character {
    return super.play(this.animationsKeyMap[key], ignoreIfPlaying, startFrame) as Character;
  }
}
