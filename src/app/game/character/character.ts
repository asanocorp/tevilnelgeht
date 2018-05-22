import { CharacterData } from './character-manager';

export class Character extends Phaser.GameObjects.PathFollower {
  private animationsKeyMap;

  public attachment: CharacterData;

  public constructor(
    private creature: any,
    private classConfig: any,
    scene: Phaser.Scene,
    path: Phaser.Curves.Path,
    x: number,
    y: number,
  ) {
    super(scene, path, x, y, creature.defaultTexture);
    this.animationsKeyMap = { ...creature.animationsKeyMap };
    this.setOrigin(creature.origin.x, creature.origin.y);
  }

  public act(cost: (c) => void): Promise<void> {
    return new Promise((unlock: () => void) => this.emit('turn', this, cost, unlock));
  }

  public play(key: string, ignoreIfPlaying = false, startFrame = 0): Character {
    return super.play(this.animationsKeyMap[key], ignoreIfPlaying, startFrame) as Character;
  }
}
