import { TerrainService } from '../terrain/terrain.service';

export class Level extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;

  public constructor(key: string, private terrainService: TerrainService) {
    super({ key });
  }

  public create(): void {
    this.generate();
  }

  private generate(): void {
    const width = 9;
    const height = 9;

    this.map = this.make.tilemap({
      tileWidth: this.terrainService.tileWidth,
      tileHeight: this.terrainService.tileHeight,
      width,
      height
    });

    this.map.createBlankDynamicLayer(
      'Layer 1',
      this.map.addTilesetImage(this.terrainService.tilesetImageKey),
      undefined,
      undefined,
      undefined,
      undefined
    );

    this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, 0);
    for (let x = 1; x < width - 1; ++x) {
      this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), x, 0);
    }
    this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), width - 1, 0);

    for (let y = 1; y < height - 1; ++y) {
      this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, y);
      for (let x = 1; x < width - 1; ++x) {
        this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'floor'), x, y);
      }
      this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), width - 1, y);
    }

    this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, width - 1);
    for (let x = 1; x < width - 1; ++x) {
      this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), x, width - 1);
    }
    this.map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), width - 1, width - 1);
  }
}
