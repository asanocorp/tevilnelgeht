export interface ItemConfig {
  itemId: string;
  itemType: string;
  texture: {
    key: string;
    data: string[];
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
    equippedColorPaletteIndex?: string;
    processCreatureEquippedTextureConfig?: (
      creatureType: string,
      creatureTexture: {
        key: string;
        data: string[];
        bodyPart: {
          [key: string]: Phaser.Geom.Rectangle[];
        };
        textureMargins?: { top: number; right: number; bottom: number; left: number; };
        shadowColor?: string;
      },
      itemConfig: ItemConfig
    ) => {
      key: string;
      data: string[];
      bodyPart: {
        [key: string]: Phaser.Geom.Rectangle[];
      };
      textureMargins?: { top: number; right: number; bottom: number; left: number; };
      shadowColor?: string;
    };
  };
  equipSlots?: string[];
}
