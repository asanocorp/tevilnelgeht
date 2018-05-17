export const data = [
  '................................',
  '................................',
  '................................',
  '...............77...............',
  '...............77...............',
  '...............77...............',
  '............77766777............',
  '...........7777777777...........',
  '...........7..7777..7...........',
  '..........77..7777..77..........',
  '..........77..7777..77..........',
  '.............777777.............',
  '.............77..77.............',
  '............77....77............',
  '............7......7............',
  '...........77......77...........'
];

export const sockets = {
  head: new Phaser.Geom.Rectangle(15, 1, 2, 3),
  neck: new Phaser.Geom.Rectangle(15, 4, 2, 1),
  shoulders: [new Phaser.Geom.Rectangle(12, 4, 3, 3), new Phaser.Geom.Rectangle(17, 4, 3, 3)],
  torso: [new Phaser.Geom.Rectangle(12, 4, 8, 3), new Phaser.Geom.Rectangle(14, 7, 4, 3), new Phaser.Geom.Rectangle(13, 10, 6, 1)],
  waist: new Phaser.Geom.Rectangle(14, 9, 4, 1),
  rightArm: new Phaser.Geom.Rectangle(11, 6, 1, 3),
  leftArm: new Phaser.Geom.Rectangle(20, 6, 1, 3),
  rightHand: new Phaser.Geom.Rectangle(10, 9, 2, 2),
  leftHand: new Phaser.Geom.Rectangle(20, 9, 2, 2),
  rightLeg: [new Phaser.Geom.Rectangle(13, 11, 2, 1), new Phaser.Geom.Rectangle(12, 12, 2, 2)],
  leftLeg: [new Phaser.Geom.Rectangle(17, 11, 2, 1), new Phaser.Geom.Rectangle(18, 12, 2, 2)],
  rightFoot: [new Phaser.Geom.Rectangle(13, 14, 1, 1), new Phaser.Geom.Rectangle(12, 15, 2, 1)],
  leftFoot: [new Phaser.Geom.Rectangle(19, 14, 1, 1), new Phaser.Geom.Rectangle(19, 15, 2, 1)]
};
