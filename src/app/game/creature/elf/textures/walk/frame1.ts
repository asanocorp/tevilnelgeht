export const data = [
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
  '..............7777..............',
  '.............777777.............',
  '.............77..77.............',
  '............77...77.............',
  '............7.....7.............',
  '...........77.....77............'
];

export const sockets = {
  head: new Phaser.Geom.Rectangle(15, 0, 2, 3),
  neck: new Phaser.Geom.Rectangle(15, 3, 2, 1),
  shoulders: [new Phaser.Geom.Rectangle(12, 3, 3, 3), new Phaser.Geom.Rectangle(17, 3, 3, 3)],
  torso: [new Phaser.Geom.Rectangle(12, 3, 8, 3), new Phaser.Geom.Rectangle(14, 6, 4, 4), new Phaser.Geom.Rectangle(13, 10, 6, 1)],
  waist: new Phaser.Geom.Rectangle(14, 9, 4, 1),
  rightArm: new Phaser.Geom.Rectangle(11, 5, 1, 3),
  leftArm: new Phaser.Geom.Rectangle(20, 5, 1, 3),
  rightHand: new Phaser.Geom.Rectangle(10, 8, 2, 2),
  leftHand: new Phaser.Geom.Rectangle(20, 8, 2, 2),
  rightLeg: [new Phaser.Geom.Rectangle(13, 11, 2, 1), new Phaser.Geom.Rectangle(12, 12, 2, 2)],
  leftLeg: [new Phaser.Geom.Rectangle(17, 11, 2, 1), new Phaser.Geom.Rectangle(18, 12, 2, 2)],
  rightFoot: [new Phaser.Geom.Rectangle(13, 14, 1, 1), new Phaser.Geom.Rectangle(12, 15, 2, 1)],
  leftFoot: [new Phaser.Geom.Rectangle(19, 14, 1, 1), new Phaser.Geom.Rectangle(19, 15, 2, 1)]
};
