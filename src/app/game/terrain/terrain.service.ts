import { Injectable } from '@angular/core';

import { TextureService } from '../texture/texture.service';

import { dungeon } from './dungeon';
import { TerrainDefinitions } from './terrain-definitions';

/**
 * Terrain service.
 */
@Injectable({
  providedIn: 'root'
})
export class TerrainService {
  /**
   * Pixel width scale factor; for use in texture generation.
   */
  private readonly pixelWidth = TerrainDefinitions.pixelWidth;

  /**
   * Pixel height scale factor; for use in texture generation.
   */
  private readonly pixelHeight = TerrainDefinitions.pixelHeight;

  /**
   * Tile width in pixels for source texture data.
   */
  private readonly tileWidthInPixels = TerrainDefinitions.tileWidthInPixels;

  /**
   * Tile height in pixels for source texture data.
   */
  private readonly tileHeightInPixels = TerrainDefinitions.tileHeightInPixels;

  /**
   * Generated texture's tile width in pixels.
   */
  public readonly tileWidth = this.pixelWidth * this.tileWidthInPixels;

  /**
   * Generated texture's tile height in pixels.
   */
  public readonly tileHeight = this.pixelHeight * this.tileHeightInPixels;

  /**
   * Tileset image key (for use with Phaser's texture cache).
   */
  public readonly tilesetImageKey = TerrainDefinitions.tilesetImageKey;

  /**
   * Terrain category enumerations.
   */
  public readonly TerrainCategory = TerrainDefinitions.TerrainCategory;

  /**
   * Generic terrain type enumerations.
   */
  public readonly TerrainType = TerrainDefinitions.TerrainType;

  /**
   * Terrain texture type enumerations.
   */
  public readonly TerrainTextureType = TerrainDefinitions.TerrainTextureType;

  /**
   * Maps terrain category to terrain data.
   */
  private terrainIndex = {
    [TerrainDefinitions.TerrainCategory.Dungeon]: dungeon
  };

  /**
   * Map terrain category & texture type combinations to tileset index.
   */
  private tilesetIndex: { [category: string]: { [texture: string]: any; }; } = {};

  /**
   * Instantiate terrain service.
   *
   * @param textureService Texture service.
   */
  public constructor(private textureService: TextureService) { }

  /**
   * Get tileset index for given terrain category & texture combination.
   *
   * @param category Terrain category key.
   * @param texture Terrain texture key.
   */
  public getTilesetIndex(category: string, texture: string): number {
    const index = this.tilesetIndex[category][texture];
    return index !== undefined ? index : this.tilesetIndex[category][this.terrainIndex[category].defaultTexturesIndex[texture]];
  }

  /**
   * Get terrain rules for given terrain category & texture combination.
   *
   * @param category Terrain category key.
   * @param texture Terrain texture key.
   */
  public getTerrainRules(category: string, texture: string): any {
    return { ...this.terrainIndex[category].rules[texture] };
  }

  /**
   * Generate & load terrain textures as a tileset.
   *
   * @param scene Scene through which the textures are loaded.
   */
  public loadTerrainTileset(scene: Phaser.Scene): void {
    this.textureService.loadTextures(
      scene,
      [{ key: this.tilesetImageKey, data: this.buildTilesetData() }],
      this.pixelWidth,
      this.pixelHeight
    );
  }

  /**
   * Build tileset texture data from terrain texture data
   */
  private buildTilesetData(): string[] {
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

    return tilesetData;
  }
}
