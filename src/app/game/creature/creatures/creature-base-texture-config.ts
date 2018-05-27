export interface CreatureBaseTextureConfig {
  data: string[];
  sockets: {
    [key: string]: Phaser.Geom.Rectangle[];
  };
  textureMargins?: { top: number; right: number; bottom: number; left: number; };
  shadowColor?: string;
}
