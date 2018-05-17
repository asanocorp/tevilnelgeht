import { TerrainDefinitions } from './terrain-definitions';

export const palette = {
  textures: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map(paletteIndex => {
    const width = TerrainDefinitions.tileWidthInPixels;
    const height = TerrainDefinitions.tileHeightInPixels;

    const data = [];
    for (let row = 0; row < height; ++row) {
      data.push(paletteIndex.repeat(width));
    }

    return { data, key: paletteIndex };
  })
};
