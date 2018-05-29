import { CreatureTextureConfig } from '../creature/creature-texture-config';

import { ItemTextureConfig } from './item-texture-config';

export interface ItemConfig {
  itemId: string;
  itemType: string;
  texture: ItemTextureConfig;
  equipSlots?: string[];
  condition?: string;
}
