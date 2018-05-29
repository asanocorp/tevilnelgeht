import { ItemDefinitions } from '../item/item-definitions';

import { CreatureAnimation } from './creature-animation.enum';

enum HumanoidCreatureBodyPart {
  Head = 'head',
  Torso = 'torso',
  RightArm = 'rightArm',
  LeftArm = 'leftArm',
  RightHand = 'rightHand',
  LeftHand = 'leftHand',
  RightLeg = 'rightLeg',
  LeftLeg = 'leftLeg',
  RightFoot = 'rightFoot',
  LeftFoot = 'leftFoot'
}

export class HumanoidCreatureDefinitions {
  public static readonly textureMargins = { top: 1, right: 1, bottom: 0, left: 1 };

  public static readonly textureOrigin = { x: 0.5, y: 1 };

  public static readonly shadowColor = 'black';

  public static readonly animationKeys = [CreatureAnimation.Idle, CreatureAnimation.WalkLeft, CreatureAnimation.WalkRight] as string[];

  public static readonly animationConfigs = {
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
  };

  public static readonly itemEquipSlotRenderOrder = [
    ItemDefinitions.ItemEquipSlot.Cloak,
    ItemDefinitions.ItemEquipSlot.Chest,
    ItemDefinitions.ItemEquipSlot.Neck,
    ItemDefinitions.ItemEquipSlot.Belt,
    ItemDefinitions.ItemEquipSlot.Leg,
    ItemDefinitions.ItemEquipSlot.Foot,
    ItemDefinitions.ItemEquipSlot.Arm,
    ItemDefinitions.ItemEquipSlot.Hand,
    ItemDefinitions.ItemEquipSlot.Ring,
    ItemDefinitions.ItemEquipSlot.Head,
    ItemDefinitions.ItemEquipSlot.Wieldable
  ] as string[];

  public static readonly BodyPart = HumanoidCreatureBodyPart;

  public static readonly bodyPartTree = {
    root: HumanoidCreatureBodyPart.Torso,
    [HumanoidCreatureBodyPart.Torso]: {
      slots: [
        ItemDefinitions.ItemEquipSlot.Belt,
        ItemDefinitions.ItemEquipSlot.Chest,
        ItemDefinitions.ItemEquipSlot.Quiver,
        ItemDefinitions.ItemEquipSlot.Cloak,
        ItemDefinitions.ItemEquipSlot.Neck
      ],
      children: {
        [HumanoidCreatureBodyPart.Head]: {
          slots: [
            ItemDefinitions.ItemEquipSlot.Head
          ]
        },
        [HumanoidCreatureBodyPart.RightArm]: {
          slots: [
            ItemDefinitions.ItemEquipSlot.Arm
          ],
          children: {
            [HumanoidCreatureBodyPart.RightHand]: {
              slots: [
                ItemDefinitions.ItemEquipSlot.Ring,
                ItemDefinitions.ItemEquipSlot.Wieldable,
                ItemDefinitions.ItemEquipSlot.Hand
              ]
            }
          }
        },
        [HumanoidCreatureBodyPart.LeftArm]: {
          slots: [
            ItemDefinitions.ItemEquipSlot.Arm
          ],
          children: {
            [HumanoidCreatureBodyPart.LeftHand]: {
              slots: [
                ItemDefinitions.ItemEquipSlot.Ring,
                ItemDefinitions.ItemEquipSlot.Wieldable,
                ItemDefinitions.ItemEquipSlot.Hand
              ]
            }
          }
        },
        [HumanoidCreatureBodyPart.RightLeg]: {
          slots: [
            ItemDefinitions.ItemEquipSlot.Leg
          ],
          children: {
            [HumanoidCreatureBodyPart.RightFoot]: {
              slots: [
                ItemDefinitions.ItemEquipSlot.Foot
              ]
            }
          }
        },
        [HumanoidCreatureBodyPart.LeftLeg]: {
          slots: [
            ItemDefinitions.ItemEquipSlot.Leg
          ],
          children: {
            [HumanoidCreatureBodyPart.LeftFoot]: {
              slots: [
                ItemDefinitions.ItemEquipSlot.Foot
              ]
            }
          }
        }
      }
    }
  };

  public static readonly abilityDice = '3d6';
}
