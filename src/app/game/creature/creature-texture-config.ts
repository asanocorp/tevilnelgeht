export interface CreatureTextureConfig {
  key: string;
  data: string[];
  bodyPart: {
    [key: string]: Phaser.Geom.Rectangle[];
  };
  textureMargins?: { top: number; right: number; bottom: number; left: number; };
  shadowColor?: string;
}
