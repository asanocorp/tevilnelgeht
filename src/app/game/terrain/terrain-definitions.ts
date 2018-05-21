enum TerrainType { Wall = 'wall', Floor = 'floor' }

enum TerrainSubType { Floor = 'floor', WallBottomFace = 'wallBottomFace', WallNoFace = 'wallNoFace' }

enum TerrainCategory { Dungeon = 'dungeon' }

export class TerrainDefinitions {
  public static readonly pixelWidth = 3;

  public static readonly pixelHeight = 3;

  public static readonly tileWidthInPixels = 16;

  public static readonly tileHeightInPixels = 16;

  public static readonly tilesetImageKey = 'terrain';

  public static readonly defaultValuesByTerrainType = {
    [TerrainType.Wall]: {
      rules: {
        blockMove: true,
        blockLight: true,
        blockVision: true
      },
      randomWeight: 20
    },
    [TerrainType.Floor]: {
      rules: {
        blockMove: false,
        blockLight: false,
        blockVision: false
      },
      randomWeight: 20
    }
  };

  public static readonly TerrainType = TerrainType;

  public static readonly TerrainSubType = TerrainSubType;

  public static readonly TerrainCategory = TerrainCategory;
}
