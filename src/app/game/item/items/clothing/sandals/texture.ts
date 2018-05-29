import { CreatureDefinitions } from '../../../../creature/creature-definitions';
import { CreatureTextureConfig } from '../../../../creature/creature-texture-config';

import { ItemConfig } from '../../../item-config';
import { ItemDefinitions } from '../../../item-definitions';

export const data = [
  '............000.',
  '...........0***0',
  '...........0***0',
  '.....000...0***0',
  '000000*000.00000',
  '0********0.0***0',
  '0000000000..000.'
];

export const colorPaletteIndex = {
  '': '6',
  [ItemDefinitions.ItemCondition.Exquisite]: 'E',
  [ItemDefinitions.ItemCondition.Fine]: 'D',
  [ItemDefinitions.ItemCondition.Ragged]: '1',
  [ItemDefinitions.ItemCondition.Worn]: '5'
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

  const leftFoot = creatureTexture.bodyPart[creatureDefaults.BodyPart.LeftFoot];
  const rightFoot = creatureTexture.bodyPart[creatureDefaults.BodyPart.RightFoot];

  const leftFootBottom = leftFoot[leftFoot.length - 1];
  const rightFootBottom = rightFoot[rightFoot.length - 1];

  const colorIndex = itemConfig.texture.colorPaletteIndex[itemConfig.condition || ''];

  let row = creatureTexture.data[leftFootBottom.bottom - 1];
  creatureTexture.data[leftFootBottom.bottom - 1]
    = row.substr(0, leftFootBottom.right - 1) + colorIndex + row.substr(leftFootBottom.right);

  row = creatureTexture.data[rightFootBottom.bottom - 1];
  creatureTexture.data[rightFootBottom.bottom - 1]
    = row.substr(0, rightFootBottom.left) + colorIndex + row.substr(rightFootBottom.left + 1);

  return creatureTexture;
}
