import { Level } from './level';

export class PathGraphics extends Phaser.GameObjects.Graphics {
  public constructor(private level: Level) {
    super(level, {});
    level.add.existing(this);
  }

  public drawPath(path: Phaser.Math.Vector2[]): void {
    const startPosition = this.level.getPlacementXY(path[0].x, path[0].y);
    const pathForGraphic = new (Phaser.Curves as any).Path(startPosition.x, startPosition.y);

    path.forEach(tilePosition => {
      const worldPosition = this.level.getPlacementXY(tilePosition.x, tilePosition.y);
      pathForGraphic.lineTo(worldPosition.x, worldPosition.y);
    });

    this.lineStyle(2, 0xff0000, 1);

    pathForGraphic.draw(this);
  }
}
