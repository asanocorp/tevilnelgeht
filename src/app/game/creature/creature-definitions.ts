enum CreatureType { Humanoid = 'humanoid' }

enum CreatureId {
  Dwarf = 'dwarf',
  Elf = 'elf',
  Halfling = 'halfling',
  Human = 'human'
}

enum CreatureEquipmentSlot {
  Feet = 'feet',
  Hands = 'hands',
  Legs = 'legs',
  Torso = 'torso',
  Neck = 'neck',
  Waist = 'waist',
  Head = 'head',
  Shoulders = 'shoulders',
  RightFinger = 'rightFinger',
  LeftFinger = 'leftFinger',
  RightActive = 'rightActive',
  LeftActive = 'leftActive'
}

enum CreatureAnimation {
  Idle = 'idle',
  WalkRight = 'walkRight',
  WalkLeft = 'walkLeft'
}

enum CreatureAbility {
  Strength = 'Strength',
  Dexterity = 'Dexterity',
  Constitution = 'Constitution',
  Intelligence = 'Intelligence',
  Wisdom = 'Wisdom',
  Charisma = 'Charisma'
}

enum CreatureAbilityBoundType {
  Minimum = 'minimum',
  Maximum = 'maximum'
}

export class CreatureDefinitions {
  public static readonly pixelWidth = 2;

  public static readonly pixelHeight = 2;

  public static readonly playableCreatureIds = [CreatureId.Dwarf, CreatureId.Elf, CreatureId.Halfling, CreatureId.Human] as string[];

  public static readonly defaultValuesByCreatureType = {
    [CreatureType.Humanoid]: {
      textureMargins: { top: 1, right: 1, bottom: 0, left: 1 },
      textureOrigin: { x: 0.5, y: 1 },
      shadowColor: 'black',
      animationKeys: [CreatureAnimation.Idle, CreatureAnimation.WalkLeft, CreatureAnimation.WalkRight] as string[],
      animationConfigs: {
        [CreatureAnimation.Idle]: {
          frameRate: 1,
          frames: [
            { key: 'idle0' },
            { key: 'idle1' }
          ],
          repeat: -1
        },
        [CreatureAnimation.WalkRight]: {
          frameRate: 4,
          frames: [
            { key: 'walk1' },
            { key: 'walk2' },
            { key: 'walk3' },
            { key: 'walk0' }
          ],
          repeat: 0
        },
        [CreatureAnimation.WalkLeft]: {
          frameRate: 4,
          frames: [
            { key: 'walk3' },
            { key: 'walk2' },
            { key: 'walk1' },
            { key: 'walk0' }
          ],
          repeat: 0
        }
      },
      abilityDice: '3d6',
      equipmentSlots: [
        CreatureEquipmentSlot.Feet,
        CreatureEquipmentSlot.Hands,
        CreatureEquipmentSlot.Legs,
        CreatureEquipmentSlot.Torso,
        CreatureEquipmentSlot.Neck,
        CreatureEquipmentSlot.Waist,
        CreatureEquipmentSlot.Shoulders,
        CreatureEquipmentSlot.RightFinger,
        CreatureEquipmentSlot.LeftFinger,
        CreatureEquipmentSlot.RightActive,
        CreatureEquipmentSlot.LeftActive,
        CreatureEquipmentSlot.Head
      ]
    }
  };

  public static readonly CreatureId = CreatureId;

  public static readonly CreatureType = CreatureType;

  public static readonly CreatureEquipmentSlot = CreatureEquipmentSlot;

  public static readonly CreatureAnimation = CreatureAnimation;

  public static readonly CreatureAbility = CreatureAbility;

  public static readonly CreatureAbilityBoundType = CreatureAbilityBoundType;
}
