import { HumanoidCreatureDefinitions } from '../../../humanoid-creature-definitions';

const Rect = Phaser.Geom.Rectangle;

export const data = [
  '....77....',
  '....77....',
  '..776677..',
  '.77777777.',
  '.7.7777.7.',
  '77.7777.77',
  '77.7777.77',
  '...7777...',
  '..77..7...',
  '..7...7...',
  '.77...77..'
];

export const bodyPart = {
  [HumanoidCreatureDefinitions.BodyPart.Head]: [new Rect(4, 0, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.LeftArm]: [new Rect(8, 3, 1, 2)],
  [HumanoidCreatureDefinitions.BodyPart.LeftFoot]: [new Rect(6, 9, 1, 1), new Rect(6, 10, 2, 1)],
  [HumanoidCreatureDefinitions.BodyPart.LeftHand]: [new Rect(8, 5, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.LeftLeg]: [new Rect(6, 8, 1, 1)],
  [HumanoidCreatureDefinitions.BodyPart.RightArm]: [new Rect(1, 3, 1, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightFoot]: [new Rect(2, 9, 1, 1), new Rect(1, 10, 2, 1)],
  [HumanoidCreatureDefinitions.BodyPart.RightHand]: [new Rect(0, 5, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightLeg]: [new Rect(2, 8, 2, 1)],
  [HumanoidCreatureDefinitions.BodyPart.Torso]: [new Rect(2, 2, 6, 2), new Rect(3, 4, 4, 4)]
};
