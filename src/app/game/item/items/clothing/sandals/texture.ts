import { CreatureDefinitions } from '../../../../creature/creature-definitions';
import { CreatureTextureConfig } from '../../../../creature/creature-texture-config';

import { ItemConfig } from '../../../item-config';

export const data = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................'
];

export const equippedColorPaletteIndex = '6';

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

  let row = creatureTexture.data[leftFootBottom.bottom - 1];
  creatureTexture.data[leftFootBottom.bottom - 1]
    = row.substr(0, leftFootBottom.right - 1) + itemConfig.texture.equippedColorPaletteIndex + row.substr(leftFootBottom.right);

  row = creatureTexture.data[rightFootBottom.bottom - 1];
  creatureTexture.data[rightFootBottom.bottom - 1]
    = row.substr(0, rightFootBottom.left) + itemConfig.texture.equippedColorPaletteIndex + row.substr(rightFootBottom.left + 1);

  return creatureTexture;
}
