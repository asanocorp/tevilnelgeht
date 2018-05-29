import { ItemDefinitions } from '../item/item-definitions';

import { CreatureBaseAnimationConfig } from './creatures/creature-base-animation-config';
import { CreatureAnimation } from './creature-animation.enum';
import { CreatureBodyPartTree } from './creature-body-part-tree';

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

const IES = ItemDefinitions.ItemEquipSlot;

export class HumanoidCreatureDefinitions {
  public static readonly textureMargins = { top: 1, right: 1, bottom: 0, left: 1 };

  public static readonly textureOrigin = { x: 0.5, y: 1 };

  public static readonly shadowColor = 'black';

  public static readonly animationKeys = [CreatureAnimation.Idle, CreatureAnimation.WalkLeft, CreatureAnimation.WalkRight] as string[];

  public static readonly animationConfigs: { [key: string]: CreatureBaseAnimationConfig } = {
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
    IES.Cloak,
    IES.Chest,
    IES.Neck,
    IES.Belt,
    IES.Leg,
    IES.Foot,
    IES.Arm,
    IES.Hand,
    IES.Ring,
    IES.Head,
    IES.Wieldable
  ] as string[];

  public static readonly BodyPart = HumanoidCreatureBodyPart;

  public static readonly bodyPartTree: CreatureBodyPartTree = {
    root: HumanoidCreatureBodyPart.Torso,
    [HumanoidCreatureBodyPart.Torso]: {
      slots: [IES.Belt, IES.Chest, IES.Quiver, IES.Cloak, IES.Neck],
      children: {
        [HumanoidCreatureBodyPart.Head]: { slots: [IES.Head] },
        [HumanoidCreatureBodyPart.RightArm]: {
          slots: [IES.Arm],
          children: {
            [HumanoidCreatureBodyPart.RightHand]: { slots: [IES.Ring, IES.Wieldable, IES.Hand] }
          }
        },
        [HumanoidCreatureBodyPart.LeftArm]: {
          slots: [IES.Arm],
          children: {
            [HumanoidCreatureBodyPart.LeftHand]: { slots: [IES.Ring, IES.Wieldable, IES.Hand] }
          }
        },
        [HumanoidCreatureBodyPart.RightLeg]: {
          slots: [IES.Leg],
          children: {
            [HumanoidCreatureBodyPart.RightFoot]: { slots: [IES.Foot] }
          }
        },
        [HumanoidCreatureBodyPart.LeftLeg]: {
          slots: [IES.Leg],
          children: {
            [HumanoidCreatureBodyPart.LeftFoot]: { slots: [IES.Foot] }
          }
        }
      }
    }
  };

  public static readonly abilityDice = '3d6';
}
