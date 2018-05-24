import { Injectable } from '@angular/core';

import { CharacterService } from '../character/character.service';
import { TerrainService } from '../terrain/terrain.service';
import { Level } from './level';
import { LevelTemplate } from './level-template';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private levelCache: { [id: string]: Level } = {};

  private levelTemplate: { [id: string]: string } = {
    dungeon: 'dungeon'
  };

  public constructor(private characterService: CharacterService, private terrainService: TerrainService) { }

  public load(levelId: string): Level {
    return this.getLevel(levelId);
  }

  private getLevel(levelId: string): Level {
    let level = this.levelCache[levelId];

    if (level) {
      return level;
    }

    this.levelCache[levelId] = level = this.generateLevel(levelId);

    return level;
  }

  private generateLevel(levelId: string): Level {
    switch (this.levelTemplate[levelId]) {
      case 'dungeon':
        return new Level(levelId, this.generateDungeon());
      default:
        break;
    }
  }

  private generateDungeon(): LevelTemplate {
    const width = 9;
    const height = 9;

    const terrainCategory = this.terrainService.TerrainCategory.Dungeon;
    const terrainTextureTypes = this.terrainService.TerrainTextureType;

    const wallNoFaceRules = this.terrainService.getTerrainRules(terrainCategory, terrainTextureTypes.WallNoFace);
    const wallBottomFaceRules = this.terrainService.getTerrainRules(terrainCategory, terrainTextureTypes.WallBottomFace);
    const floorRules = this.terrainService.getTerrainRules(terrainCategory, terrainTextureTypes.Floor);

    const datamap = {};

    datamap[0 + ',' + 0] = { terrainRules: wallNoFaceRules };
    for (let x = 1; x < width - 1; ++x) {
      datamap[x + ',' + 0] = { terrainRules: wallBottomFaceRules };
    }
    datamap[(width - 1) + ',' + 0] = { terrainRules: wallNoFaceRules };

    for (let y = 1; y < height - 1; ++y) {
      datamap[0 + ',' + y] = { terrainRules: wallNoFaceRules };
      for (let x = 1; x < width - 1; ++x) {
        datamap[x + ',' + y] = { terrainRules: floorRules };
      }
      datamap[(width - 1) + ',' + y] = { terrainRules: wallNoFaceRules };
    }

    datamap[0 + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };
    for (let x = 1; x < width - 1; ++x) {
      datamap[x + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };
    }
    datamap[(width - 1) + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };

    const wallNoFaceIndex = this.terrainService.getTilesetIndex(terrainCategory, this.terrainService.TerrainTextureType.WallNoFace);
    const wallBottomFaceIndex = this.terrainService.getTilesetIndex(terrainCategory, this.terrainService.TerrainTextureType.WallBottomFace);
    const floorIndex = this.terrainService.getTilesetIndex(terrainCategory, this.terrainService.TerrainTextureType.Floor);

    const tilesetIndex = {
      [this.terrainService.TerrainTextureType.WallNoFace]: wallNoFaceIndex,
      [this.terrainService.TerrainTextureType.WallBottomFace]: wallBottomFaceIndex,
      [this.terrainService.TerrainTextureType.Floor]: floorIndex
    };

    return {
      width,
      height,
      tileWidth: this.terrainService.tileWidth,
      tileHeight: this.terrainService.tileHeight,
      tileset: this.terrainService.tilesetImageKey,
      tilesetIndex,
      datamap
    };
  }
}
