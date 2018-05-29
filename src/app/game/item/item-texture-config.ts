import { CreatureTextureConfig } from '../creature/creature-texture-config';

import { ItemConfig } from './item-config';

export interface ItemTextureConfig {
  key: string;
    data: string[];
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
    colorPaletteIndex?: string;
    processCreatureEquippedTextureConfig?: (
      creatureType: string,
      creatureTexture: CreatureTextureConfig,
      itemConfig: ItemConfig
    ) => CreatureTextureConfig;
}
