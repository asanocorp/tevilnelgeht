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
  '77..7777..77',
  '...777777...',
  '...77..77...',
  '...77..77...',
  '...77..77...',
  '...7....7...',
  '..77....77..'
];

export const sockets = {
  head: [new Rect(5, 0, 2, 3)],
  neck: [new Rect(5, 3, 2, 1)],
  shoulders: [new Rect(2, 3, 3, 3), new Rect(7, 3, 3, 3)],
  torso: [new Rect(2, 3, 8, 3), new Rect(4, 6, 4, 4), new Rect(3, 10, 6, 1)],
  waist: [new Rect(4, 9, 4, 1)],
  rightArm: [new Rect(1, 5, 1, 3)],
  leftArm: [new Rect(10, 5, 1, 3)],
  rightHand: [new Rect(0, 8, 2, 2)],
  leftHand: [new Rect(10, 8, 2, 2)],
  rightFinger: [new Rect(0, 9, 1, 1)],
  leftFinger: [new Rect(11, 9, 1, 1)],
  rightLeg: [new Rect(3, 11, 2, 3)],
  leftLeg: [new Rect(7, 11, 2, 3)],
  rightFoot: [new Rect(3, 14, 1, 1), new Rect(2, 15, 2, 1)],
  leftFoot: [new Rect(8, 14, 1, 1), new Rect(8, 15, 2, 1)]
};
