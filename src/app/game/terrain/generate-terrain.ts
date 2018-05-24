import { TerrainDefinitions } from './terrain-definitions';

export function generateTerrain(data: any): any {
  const defaultTexturesIndex = {};
  const rules = {};
  const textures = [];

  Object.keys(data).map(textureType => {
    defaultTexturesIndex[textureType] = data[textureType].defaultTexture;
    rules[textureType] = {
      ...TerrainDefinitions.defaultValuesByTerrainType[data[textureType].rules.terrainType].rules,
      ...data[textureType].rules
    };
    Object.keys(data[textureType].textures).map(textureKey => {
      textures.push({ ...data[textureType].textures[textureKey], key: textureKey });
    });
  });

  return {
    textures,
    defaultTexturesIndex,
    rules
  };
}
