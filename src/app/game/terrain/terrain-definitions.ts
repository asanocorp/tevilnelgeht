/**
 * Generic terrain type enumerations.
 */
enum TerrainType { Wall = 'wall', Floor = 'floor' }

/**
 * Terrain texture type enumerations.
 */
enum TerrainTextureType { Floor = 'floor', WallBottomFace = 'wallBottomFace', WallNoFace = 'wallNoFace' }

/**
 * Terrain category enumerations.
 */
enum TerrainCategory { Dungeon = 'dungeon' }

/**
 * Terrain definitions & constant values.
 */
export class TerrainDefinitions {
  /**
   * Pixel width scale factor; for use in texture generation.
   */
  public static readonly pixelWidth = 3;

  /**
   * Pixel height scale factor; for use in texture generation.
   */
  public static readonly pixelHeight = 3;

  /**
   * Tile width in pixels for source texture data.
   */
  public static readonly tileWidthInPixels = 16;

  /**
   * Tile height in pixels for source texture data.
   */
  public static readonly tileHeightInPixels = 16;

  /**
   * Tileset image key (for use with Phaser's texture cache).
   */
  public static readonly tilesetImageKey = 'terrain';

  /**
   * Default values by generic terrain type.
   */
  public static readonly defaultValuesByTerrainType = {
    [TerrainType.Wall]: {
      rules: {
        blockMove: true,
        blockLight: true,
        blockVision: true
      }
    },
    [TerrainType.Floor]: {
      rules: {
        blockMove: false,
        blockLight: false,
        blockVision: false
      }
    }
  };

  /**
   * Generic terrain type enumerations.
   */
  public static readonly TerrainType = TerrainType;

  /**
   * Terrain texture type enumerations.
   */
  public static readonly TerrainTextureType = TerrainTextureType;

  /**
   * Terrain category enumerations.
   */
  public static readonly TerrainCategory = TerrainCategory;
}
