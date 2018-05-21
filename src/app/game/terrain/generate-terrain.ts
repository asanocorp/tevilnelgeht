import { TerrainDefinitions } from './terrain-definitions';

export function generateTerrain(data: any): any {
  const defaultTexturesIndex = {};
  const rules = {};
  const textures = [];

  Object.keys(data).map(subTypeKey => {
    defaultTexturesIndex[subTypeKey] = data[subTypeKey].defaultTexture;
    rules[subTypeKey] = {
      ...TerrainDefinitions.defaultValuesByTerrainType[data[subTypeKey].rules.terrainType].rules,
      ...data[subTypeKey].rules
    };
    Object.keys(data[subTypeKey].textures).map(textureKey => {
      textures.push({ ...data[subTypeKey].textures[textureKey], key: textureKey });
    });
  });

  return {
    textures,
    defaultTexturesIndex,
    rules
  };
}
