import { CreatureDefinitions } from '../creature-definitions';

import { CreatureBaseTextureConfig } from './creature-base-texture-config';

export interface CreatureBaseConfig {
  creatureId: string;
  creatureType: string;
  properName: string;
  properNamePlural: string;
  restrictions: {
    abilities: {
      ability: string;
      score: number;
      bound: string;
    }[];
    classes: string[];
  };
  textureOrigin?: { x: number; y: number; };
  textures: {
    [key: string]: CreatureBaseTextureConfig;
  };
  animationConfigs?: {
    [key: string]: { frameRate: number; frames: { key: string; }[]; repeat: number; }
  };
  itemEquipSlotRenderOrder?: string[];
  bodyPartTree?: any;
  abilityDice?: { [key: string]: string; };
}
