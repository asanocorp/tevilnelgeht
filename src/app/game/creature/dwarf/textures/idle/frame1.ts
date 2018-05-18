const Rect = Phaser.Geom.Rectangle;

export const data = [
  '.....777.....',
  '.....777.....',
  '.....777.....',
  '..777666777..',
  '.77777777777.',
  '.7.7777777.7.',
  '77.7777777.77',
  '77.7777777.77',
  '...777.777...',
  '..777...777..',
  '..77.....77..',
  '.777.....777.'
];

export const sockets = {
  head: [new Rect(5, 0, 3, 3)],
  neck: [new Rect(5, 3, 3, 1)],
  shoulders: [new Rect(2, 3, 3, 2), new Rect(8, 3, 3, 2)],
  torso: [new Rect(2, 3, 9, 2), new Rect(3, 5, 7, 2)],
  waist: [new Rect(3, 6, 7, 1)],
  rightArm: [new Rect(1, 4, 1, 2)],
  leftArm: [new Rect(11, 4, 1, 3)],
  rightHand: [new Rect(0, 6, 2, 2)],
  leftHand: [new Rect(11, 6, 2, 2)],
  rightLeg: [new Rect(3, 8, 2, 1), new Rect(2, 9, 2, 2)],
  leftLeg: [new Rect(8, 8, 2, 1), new Rect(9, 9, 2, 2)],
  rightFoot: [new Rect(2, 10, 1, 1), new Rect(1, 11, 2, 1)],
  leftFoot: [new Rect(100, 10, 1, 1), new Rect(10, 11, 2, 1)]
};
