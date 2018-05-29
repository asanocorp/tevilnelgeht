import { HumanoidCreatureDefinitions } from '../../../humanoid-creature-definitions';

const Rect = Phaser.Geom.Rectangle;

export const data = [
  '.....777.....',
  '.....777.....',
  '.....777.....',
  '..777666777..',
  '.77777777777.',
  '.7.7777777.7.',
  '77.7777777.77',
  '77.777.777.77',
  '..777...777..',
  '..77.....77..',
  '.777.....777.'
];

export const bodyPart = {
  [HumanoidCreatureDefinitions.BodyPart.Head]: [new Rect(5, 0, 3, 3)],
  [HumanoidCreatureDefinitions.BodyPart.LeftArm]: [new Rect(11, 4, 1, 3)],
  [HumanoidCreatureDefinitions.BodyPart.LeftFoot]: [new Rect(9, 9, 2, 1), new Rect(9, 10, 3, 1)],
  [HumanoidCreatureDefinitions.BodyPart.LeftHand]: [new Rect(11, 6, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.LeftLeg]: [new Rect(7, 7, 3, 1), new Rect(8, 8, 3, 1)],
  [HumanoidCreatureDefinitions.BodyPart.RightArm]: [new Rect(1, 4, 1, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightFoot]: [new Rect(2, 9, 2, 1), new Rect(1, 10, 3, 1)],
  [HumanoidCreatureDefinitions.BodyPart.RightHand]: [new Rect(0, 6, 2, 2)],
  [HumanoidCreatureDefinitions.BodyPart.RightLeg]: [new Rect(3, 7, 3, 1), new Rect(2, 8, 3, 1)],
  [HumanoidCreatureDefinitions.BodyPart.Torso]: [new Rect(2, 3, 9, 2), new Rect(3, 5, 7, 2)]
};
