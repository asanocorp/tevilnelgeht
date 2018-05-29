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
    bodyPart: {
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
  itemEquipSlotRenderOrder: string[];
  bodyPartTree: any;
  abilityDice: { [key: string]: string; };
}
