import { CreatureDefinitions } from '../../../../creature/creature-definitions';
import { CreatureTextureConfig } from '../../../../creature/creature-texture-config';

import { ItemConfig } from '../../../item-config';
import { ItemDefinitions } from '../../../item-definitions';

export const data = [
  '.000000000.',
  '00**000**00',
  '0*********0',
  '0*********0',
  '0*********0',
  '.0*******0.',
  '.0*******0.',
  '.0*******0.',
  '.0*******0.',
  '.0*******0.',
  '..0000000..',
];

export const colorPaletteIndex = {
  '': 'D', // 'A', // '6',
  [ItemDefinitions.ItemCondition.Exquisite]: 'B', // 'F', // 'E',
  [ItemDefinitions.ItemCondition.Fine]: '8', // '4', // 'D',
  [ItemDefinitions.ItemCondition.Ragged]: '1', // '5', // '1',
  [ItemDefinitions.ItemCondition.Worn]: '6' // '9' // '5'
};

export function processCreatureEquippedTextureConfig(
  cretureType: string,
  creatureTexture: CreatureTextureConfig,
  itemConfig: ItemConfig
): CreatureTextureConfig {
  switch (cretureType) {
    case CreatureDefinitions.CreatureType.Humanoid:
      return processHumanoidTexture(creatureTexture, itemConfig);
    default:
      break;
  }

  return creatureTexture;
}

function processHumanoidTexture(creatureTexture: CreatureTextureConfig, itemConfig: ItemConfig): CreatureTextureConfig {
  const creatureDefaults = CreatureDefinitions.defaultValuesByCreatureType[CreatureDefinitions.CreatureType.Humanoid];

  const torso = creatureTexture.bodyPart[creatureDefaults.BodyPart.Torso];

  const colorIndex = itemConfig.texture.colorPaletteIndex[itemConfig.condition || ''];

  torso.forEach(rect => {
    for (let y = rect.y, len = rect.bottom; y < len; ++y) {
      const row = creatureTexture.data[y];
      creatureTexture.data[y] = row.substr(0, rect.x) + colorIndex.repeat(rect.width) + row.substr(rect.right);
    }
  });

  return creatureTexture;
}
