import { CreatureAbilityRestriction } from '../creature-ability-restriction';
import { CreatureBodyPartTree } from '../creature-body-part-tree';

import { CreatureBaseAnimationConfig } from './creature-base-animation-config';
import { CreatureBaseTextureConfig } from './creature-base-texture-config';

export interface CreatureBaseConfig {
  creatureId: string;
  creatureType: string;
  properName: string;
  properNamePlural: string;
  restrictions: { abilities: CreatureAbilityRestriction[]; classes: string[]; };
  textureOrigin?: { x: number; y: number; };
  textures: { [key: string]: CreatureBaseTextureConfig; };
  animationConfigs?: { [key: string]: CreatureBaseAnimationConfig; };
  itemEquipSlotRenderOrder?: string[];
  bodyPartTree?: CreatureBodyPartTree;
  abilityDice?: { [key: string]: string; };
}
