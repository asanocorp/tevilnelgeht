import { generateTerrain } from '../generate-terrain';
import { TerrainDefinitions } from '../terrain-definitions';
import { floor } from './floor';
import { wallBottomFace } from './wall-bottom-face';
import { wallNoFace } from './wall-no-face';

const data = {
  [TerrainDefinitions.TerrainTextureType.Floor]: floor,
  [TerrainDefinitions.TerrainTextureType.WallBottomFace]: wallBottomFace,
  [TerrainDefinitions.TerrainTextureType.WallNoFace]: wallNoFace
};

export const dungeon = generateTerrain(data);
