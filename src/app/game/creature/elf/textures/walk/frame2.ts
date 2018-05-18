const Rect = Phaser.Geom.Rectangle;

export const data = [
  '.....77.....',
  '.....77.....',
  '.....77.....',
  '..77766777..',
  '.7777777777.',
  '.7..7777..7.',
  '77..7777..77',
  '77..7777..77',
  '....7777....',
  '...777777...',
  '...77..77...',
  '...77..77...',
  '...7....7...',
  '..77....77..'
];

export const sockets = {
  head: [new Rect(5, 0, 2, 3)],
  neck: [new Rect(5, 3, 2, 1)],
  shoulders: [new Rect(2, 3, 3, 2), new Rect(7, 3, 3, 2)],
  torso: [new Rect(2, 3, 8, 2), new Rect(4, 5, 4, 4), new Rect(3, 9, 6, 1)],
  waist: [new Rect(4, 8, 4, 1)],
  rightArm: [new Rect(1, 4, 1, 2)],
  leftArm: [new Rect(10, 4, 1, 2)],
  rightHand: [new Rect(0, 6, 2, 2)],
  leftHand: [new Rect(10, 6, 2, 2)],
  rightLeg: [new Rect(3, 10, 2, 2)],
  leftLeg: [new Rect(7, 10, 2, 2)],
  rightFoot: [new Rect(3, 12, 1, 1), new Rect(2, 13, 2, 1)],
  leftFoot: [new Rect(8, 12, 1, 1), new Rect(8, 13, 2, 1)]
};
