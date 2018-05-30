import { CreatureDefinitions } from '../../../../creature/creature-definitions';
import { CreatureTextureConfig } from '../../../../creature/creature-texture-config';

import { ItemConfig } from '../../../item-config';
import { ItemDefinitions } from '../../../item-definitions';

export const data = [
  '...00000...',
  '..0*000*0..',
  '.0*******0.',
  '.0*******0.',
  '0*********0',
  '0****0****0',
  '0****0****0',
  '0***0.0***0',
  '0***0.0***0',
  '0***0.0***0',
  '.0*0...0*0.',
  '.0*0...0*0.',
  '.0*0...0*0.',
  '.0*0...0*0.',
  '.000...000.'
];

export const colorPaletteIndex = {
  '': 'A', // '6',
  [ItemDefinitions.ItemCondition.Exquisite]: 'F', // 'E',
  [ItemDefinitions.ItemCondition.Fine]: '4', // 'D',
  [ItemDefinitions.ItemCondition.Ragged]: '5', // '1',
  [ItemDefinitions.ItemCondition.Worn]: '9' // '5'
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

  const leftLeg = creatureTexture.bodyPart[creatureDefaults.BodyPart.LeftLeg];
  const rightLeg = creatureTexture.bodyPart[creatureDefaults.BodyPart.RightLeg];

  const colorIndex = itemConfig.texture.colorPaletteIndex[itemConfig.condition || ''];

  [].concat(leftLeg, rightLeg).forEach(rect => {
    for (let y = rect.y, len = rect.bottom; y < len; ++y) {
      const row = creatureTexture.data[y];
      creatureTexture.data[y] = row.substr(0, rect.x) + colorIndex.repeat(rect.width) + row.substr(rect.right);
    }
  });

  const leftFoot = creatureTexture.bodyPart[creatureDefaults.BodyPart.LeftFoot];
  const rightFoot = creatureTexture.bodyPart[creatureDefaults.BodyPart.RightFoot];

  const leftFootTop = leftFoot[0];
  const rightFootTop = rightFoot[0];

  [].concat(leftFootTop, rightFootTop).forEach(rect => {
    for (let y = rect.y, len = rect.top + 1; y < len; ++y) {
      const row = creatureTexture.data[y];
      creatureTexture.data[y] = row.substr(0, rect.x) + colorIndex.repeat(rect.width) + row.substr(rect.right);
    }
  });

  return creatureTexture;
}
