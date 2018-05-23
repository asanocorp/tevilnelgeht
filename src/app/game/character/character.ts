import { CharacterData } from './character-manager';

export class Character extends Phaser.GameObjects.PathFollower {
  private animationsKeyMap;

  public attachment: CharacterData;

  public constructor(
    private creatureConfig: any,
    private classConfig: any,
    scene: Phaser.Scene,
    path: Phaser.Curves.Path,
    x: number,
    y: number,
  ) {
    super(scene, path, x, y, creatureConfig.defaultTexture);
    this.animationsKeyMap = {idle: "boots-human-idle", walkRight: "boots-human-walkRight", walkLeft: "boots-human-walkLeft"};
    // { ...creatureConfig.animationsKeyMap };
    this.setOrigin(creatureConfig.origin.x, creatureConfig.origin.y);
  }

  public act(cost: (c) => void): Promise<void> {
    return new Promise((unlock: () => void) => this.emit('turn', this, cost, unlock));
  }

  public play(key: string, ignoreIfPlaying = false, startFrame = 0): Character {
    return super.play(this.animationsKeyMap[key], ignoreIfPlaying, startFrame) as Character;
  }
}
