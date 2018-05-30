import { CreatureDefinitions } from '../../../../creature/creature-definitions';
import { CreatureTextureConfig } from '../../../../creature/creature-texture-config';

import { ItemConfig } from '../../../item-config';
import { ItemDefinitions } from '../../../item-definitions';

export const data = [
  '.....0..0......',
  '...00*00*00....',
  '..0*0*0*00*0...',
  '.00*0*0*00*0...',
  '0*0*0*0*0000.0.',
  '0*0*0*0*00*00*0',
  '0**********0**0',
  '.0********0**0.',
  '..0******0**0..',
  '...000000000...'
];

export const colorPaletteIndex = {
  '': '6', // 'D', // 'A', // '6',
  [ItemDefinitions.ItemCondition.Exquisite]: 'E', // 'B', // 'F', // 'E',
  [ItemDefinitions.ItemCondition.Fine]: 'C', // '8', // '4', // 'D',
  [ItemDefinitions.ItemCondition.Ragged]: '9', // '1', // '5', // '1',
  [ItemDefinitions.ItemCondition.Worn]: '5' // '6' // '9' // '5'
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

  const leftHand = creatureTexture.bodyPart[creatureDefaults.BodyPart.LeftHand];
  const rightHand = creatureTexture.bodyPart[creatureDefaults.BodyPart.RightHand];

  const colorIndex = itemConfig.texture.colorPaletteIndex[itemConfig.condition || ''];

  [].concat(leftHand, rightHand).forEach(rect => {
    for (let y = rect.y, len = rect.bottom; y < len; ++y) {
      const row = creatureTexture.data[y];
      creatureTexture.data[y] = row.substr(0, rect.x) + colorIndex.repeat(rect.width) + row.substr(rect.right);
    }
  });

  return creatureTexture;
}
