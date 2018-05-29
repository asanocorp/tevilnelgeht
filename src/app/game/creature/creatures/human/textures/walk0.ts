import { HumanoidCreatureDefinitions } from '../../../humanoid-creature-definitions';

const Rect = Phaser.Geom.Rectangle;

export const data = [
  '.....77.....',
  '.....77.....',
  '.....77.....',
  '..77766777..',
  '..77777777..',
  '.7777777777.',
  '.7..7777..7.',
  '.7..7777..7.',
  '77..7777..77',
  '77.777777.77',
  '...77..77...',
  '..77....77..',
  '..77....77..',
  '..7......7..',
  '.77......77.'
];

export const bodyPart = {
  [HumanoidCreatureDefinitions.BodyPart.Head]: [new Rect(5, 0, 2, 3)],
  [HumanoidCreatureDefinitions.BodyPart.LeftArm]: [new Rect(10, 5, 1, 3)],
  [HumanoidCreatureDefinitions.BodyPart.LeftFoot]: [new Rect(9, 13, 1, 1), new Rect(9, 14, 2, 1)],
  [HumanoidCreatureDefinitions.BodyPart.LeftHand]: [new Rect(10, 8, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.LeftLeg]: [new Rect(7, 10, 2, 1), new Rect(8, 11, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightArm]: [new Rect(1, 5, 1, 3)],
  [HumanoidCreatureDefinitions.BodyPart.RightFoot]: [new Rect(2, 13, 1, 1), new Rect(1, 14, 2, 1)],
  [HumanoidCreatureDefinitions.BodyPart.RightHand]: [new Rect(0, 8, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightLeg]: [new Rect(3, 10, 2, 1), new Rect(2, 11, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.Torso]: [new Rect(2, 3, 8, 3), new Rect(4, 6, 4, 3), new Rect(3, 9, 6, 1)]
};
