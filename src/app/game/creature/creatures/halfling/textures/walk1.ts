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

const bodyPart = {
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

export const sockets = {
  head: [new Rect(4, 0, 2, 2)],
  neck: [new Rect(4, 2, 2, 1)],
  shoulders: [new Rect(2, 2, 2, 2), new Rect(6, 2, 2, 2)],
  torso: [new Rect(2, 2, 6, 2), new Rect(3, 4, 4, 4)],
  waist: [new Rect(3, 6, 4, 1)],
  rightArm: [new Rect(1, 3, 1, 2)],
  leftArm: [new Rect(8, 3, 1, 2)],
  rightHand: [new Rect(0, 5, 2, 2)],
  leftHand: [new Rect(8, 5, 2, 2)],
  rightFinger: [new Rect(0, 6, 1, 1)],
  leftFinger: [new Rect(9, 6, 1, 1)],
  rightLeg: [new Rect(2, 8, 2, 1)],
  leftLeg: [new Rect(6, 8, 1, 1)],
  rightFoot: [new Rect(2, 9, 1, 1), new Rect(1, 10, 2, 1)],
  leftFoot: [new Rect(6, 9, 1, 1), new Rect(6, 10, 2, 1)]
};
