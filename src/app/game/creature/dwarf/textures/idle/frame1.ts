export const data = [
  '.................................',
  '.................................',
  '.................................',
  '.................................',
  '...............777...............',
  '...............777...............',
  '...............777...............',
  '............777666777............',
  '...........77777777777...........',
  '...........7.7777777.7...........',
  '..........77.7777777.77..........',
  '..........77.7777777.77..........',
  '.............777.777.............',
  '............777...777............',
  '............77.....77............',
  '...........777.....777...........'
];

export const sockets = {
  head: new Phaser.Geom.Rectangle(15, 4, 3, 3),
  neck: new Phaser.Geom.Rectangle(15, 7, 3, 1),
  shoulders: [new Phaser.Geom.Rectangle(12, 7, 3, 2), new Phaser.Geom.Rectangle(18, 7, 3, 2)],
  torso: [new Phaser.Geom.Rectangle(12, 7, 9, 2), new Phaser.Geom.Rectangle(13, 9, 7, 2)],
  waist: new Phaser.Geom.Rectangle(13, 10, 7, 1),
  rightArm: new Phaser.Geom.Rectangle(11, 8, 1, 2),
  leftArm: new Phaser.Geom.Rectangle(21, 8, 1, 3),
  rightHand: new Phaser.Geom.Rectangle(10, 10, 2, 2),
  leftHand: new Phaser.Geom.Rectangle(21, 10, 2, 2),
  rightLeg: [new Phaser.Geom.Rectangle(13, 12, 2, 1), new Phaser.Geom.Rectangle(12, 13, 2, 2)],
  leftLeg: [new Phaser.Geom.Rectangle(18, 12, 2, 1), new Phaser.Geom.Rectangle(19, 13, 2, 2)],
  rightFoot: [new Phaser.Geom.Rectangle(12, 14, 1, 1), new Phaser.Geom.Rectangle(11, 15, 2, 1)],
  leftFoot: [new Phaser.Geom.Rectangle(20, 14, 1, 1), new Phaser.Geom.Rectangle(20, 15, 2, 1)]
};
