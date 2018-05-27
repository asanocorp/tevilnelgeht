import { CreatureDefinitions } from './creature-definitions';
import { CreatureBaseConfig } from './creatures/creature-base-config';
import { CreatureBaseTextureConfig } from './creatures/creature-base-texture-config';

export interface CreatureConfig {
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
  defaultTexture: string;
  textureOrigin: { x: number; y: number; };
  textures: {
    key: string;
    data: string[];
    sockets: {
      [key: string]: Phaser.Geom.Rectangle[];
    };
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
  }[];
  texturesKeyMap: { [key: string]: string; };
  defaultAnimation: string;
  animationConfigs: { [key: string]: { frameRate: number; frames: { key: string; }[]; repeat: number; } };
  animationKeys: string[];
  animations: { key: string; frameRate: number; frames: { key: string; }[]; repeat: number; }[];
  animationsKeyMap: { [key: string]: string; };
  abilityDice: { [key: string]: string; };
}
