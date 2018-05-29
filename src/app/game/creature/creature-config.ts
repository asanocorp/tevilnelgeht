import { CreatureAbilityRestriction } from './creature-ability-restriction';
import { CreatureAnimationConfig } from './creature-animation-config';
import { CreatureBodyPartTree } from './creature-body-part-tree';
import { CreatureTextureConfig } from './creature-texture-config';
import { CreatureBaseAnimationConfig } from './creatures/creature-base-animation-config';

export interface CreatureConfig {
  creatureId: string;
  creatureType: string;
  properName: string;
  properNamePlural: string;
  restrictions: { abilities: CreatureAbilityRestriction[]; classes: string[]; };
  defaultTexture: string;
  textureOrigin: { x: number; y: number; };
  textures: CreatureTextureConfig[];
  texturesKeyMap: { [key: string]: string; };
  defaultAnimation: string;
  animationConfigs: { [key: string]: CreatureBaseAnimationConfig };
  animationKeys: string[];
  animations: CreatureAnimationConfig[];
  animationsKeyMap: { [key: string]: string; };
  itemEquipSlotRenderOrder: string[];
  bodyPartTree: CreatureBodyPartTree;
  abilityDice: { [key: string]: string; };
}
