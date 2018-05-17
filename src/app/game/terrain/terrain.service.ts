import { Injectable } from '@angular/core';

import { dungeon } from './dungeon';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {
  private terrainIndex = { dungeon };

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

    scene.textures.generate('terrain', { data: tilesetData, pixelWidth: 4, pixelHeight: 4 });
  }
}
