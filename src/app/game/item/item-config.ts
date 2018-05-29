import { CreatureTextureConfig } from '../creature/creature-texture-config';

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
      creatureTexture: CreatureTextureConfig,
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
