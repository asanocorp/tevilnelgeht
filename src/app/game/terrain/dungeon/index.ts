import { generateTerrain } from '../generate-terrain';
import { TerrainDefinitions } from '../terrain-definitions';
import { floor } from './floor';
import { wallBottomFace } from './wall-bottom-face';
import { wallNoFace } from './wall-no-face';

const data = {
  [TerrainDefinitions.TerrainSubType.Floor]: floor,
  [TerrainDefinitions.TerrainSubType.WallBottomFace]: wallBottomFace,
  [TerrainDefinitions.TerrainSubType.WallNoFace]: wallNoFace
};

export const dungeon = generateTerrain(data);
