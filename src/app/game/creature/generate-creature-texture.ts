import { CreatureDefinitions } from './creature-definitions';

const Rect = Phaser.Geom.Rectangle;

export function generateCreatureTexture(frame: any, rules: any): any {
  const margins = CreatureDefinitions.creatureTypes[rules.creatureType].textureMargins;

  const data = [];
  for (let y = 0; y < margins.top; ++y) {
    data.push('.'.repeat(frame.data[0].length + margins.left + margins.right));
  }
  frame.data.forEach(row => data.push('.'.repeat(margins.left) + row + '.'.repeat(margins.right)));
  for (let y = 0; y < margins.bottom; ++y) {
    data.push('.'.repeat(frame.data[0].length + margins.left + margins.right));
  }

  const sockets = {};
  Object.keys(frame.sockets).forEach(
    socketKey => frame.sockets[socketKey].map(rect => Rect.Clone(rect).setPosition(margins.left + rect.x, margins.top + rect.y))
  );

  return { data, sockets };
}
