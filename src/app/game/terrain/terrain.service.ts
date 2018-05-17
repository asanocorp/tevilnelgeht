import { Injectable } from '@angular/core';

import { dungeon } from './dungeon';
import { palette } from './palette';
import { TerrainDefinitions } from './terrain-definitions';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {
  private readonly pixelWidth = TerrainDefinitions.pixelWidth;

  private readonly pixelHeight = TerrainDefinitions.pixelHeight;

  private readonly tileWidthInPixels = TerrainDefinitions.tileWidthInPixels;

  private readonly tileHeightInPixels = TerrainDefinitions.tileHeightInPixels;

  public readonly tileWidth = this.pixelWidth * this.tileWidthInPixels;

  public readonly tileHeight = this.pixelHeight * this.tileHeightInPixels;

  private terrainIndex = { dungeon, palette };

  private tilesetIndex = {};

  public constructor() { }

  public getTileIndex(group: string, key: string): number {
    return this.tilesetIndex[group][key];
  }

  public loadTerrainTileset(scene: Phaser.Scene): void {
    const tilesetData = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    let tileIndex = 0;

    Object.keys(this.terrainIndex).forEach(terrainGroupKey => {
      const terrainGroup = this.terrainIndex[terrainGroupKey];
      this.tilesetIndex[terrainGroupKey] = {};
      terrainGroup.textures.forEach(texture => {
        texture.data.forEach((row: string, index: number) => {
          tilesetData[index] += row;
        });
        this.tilesetIndex[terrainGroupKey][texture.key] = tileIndex++;
      });
    });

    scene.textures.generate('terrain', { data: tilesetData, pixelWidth: this.pixelWidth, pixelHeight: this.pixelHeight });
  }
}
