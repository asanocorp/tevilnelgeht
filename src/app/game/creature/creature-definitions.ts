enum CreatureType { Humanoid = 'humanoid' }

export class CreatureDefinitions {
  public static readonly pixelWidth = 2;

  public static readonly pixelHeight = 2;

  public static readonly creatureTypes = {
    [CreatureType.Humanoid]: {
      textureMargins: { top: 10, right: 10, bottom: 0, left: 10 },
      textureOrigin: { x: 0.5, y: 1 }
    }
  };

  public static readonly CreatureType = CreatureType;
}
