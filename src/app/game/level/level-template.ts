export interface LevelTemplate {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  tileset: string;
  tilesetIndex: {
    [subType: string]: number;
  };
  datamap: {
    [index: string]: {
      terrainRules: any
    }
  };
}
