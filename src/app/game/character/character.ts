export class Character extends Phaser.GameObjects.PathFollower {
  private animationsKeyMap;

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
  }

  public play(key: string, ignoreIfPlaying = false, startFrame = 0): Character {
    return super.play(this.animationsKeyMap[key], ignoreIfPlaying, startFrame) as Character;
  }
}
