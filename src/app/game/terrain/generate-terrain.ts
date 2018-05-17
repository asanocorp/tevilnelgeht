export function generateTerrain(terrainGroupKey: string, texturesIndex: any): any {

  const textures = Object.keys(texturesIndex).map(key => {
    return { ...texturesIndex[key], key };
  });

  return { textures };
}
