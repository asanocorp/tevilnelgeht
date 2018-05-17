export const data = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '...............77...............',
  '...............77...............',
  '.............776677.............',
  '............77777777............',
  '............7.7777.7............',
  '...........77.7777.77...........',
  '...........77.7777.77...........',
  '..............7777..............',
  '.............77..7..............',
  '.............7...7..............',
  '............77...77.............'
];

export const sockets = {
  head: new Phaser.Geom.Rectangle(15, 5, 3, 3),
  neck: new Phaser.Geom.Rectangle(15, 8, 3, 1),
  shoulders: [new Phaser.Geom.Rectangle(12, 8, 3, 2), new Phaser.Geom.Rectangle(18, 8, 3, 2)],
  torso: [new Phaser.Geom.Rectangle(12, 8, 9, 2), new Phaser.Geom.Rectangle(13, 10, 7, 2)],
  waist: new Phaser.Geom.Rectangle(13, 10, 7, 1),
  rightArm: new Phaser.Geom.Rectangle(11, 9, 1, 2),
  leftArm: new Phaser.Geom.Rectangle(21, 9, 1, 3),
  rightHand: new Phaser.Geom.Rectangle(10, 11, 2, 2),
  leftHand: new Phaser.Geom.Rectangle(21, 11, 2, 2),
  rightLeg: [new Phaser.Geom.Rectangle(13, 12, 2, 1), new Phaser.Geom.Rectangle(12, 13, 2, 2)],
  leftLeg: [new Phaser.Geom.Rectangle(18, 12, 2, 1), new Phaser.Geom.Rectangle(19, 13, 2, 2)],
  rightFoot: [new Phaser.Geom.Rectangle(12, 14, 1, 1), new Phaser.Geom.Rectangle(11, 15, 2, 1)],
  leftFoot: [new Phaser.Geom.Rectangle(20, 14, 1, 1), new Phaser.Geom.Rectangle(20, 15, 2, 1)]
};
