import { CreatureDefinitions } from '../../../../creature/creature-definitions';
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
  creatureTexture: {
    key: string;
    data: string[];
    bodyPart: {
      [key: string]: Phaser.Geom.Rectangle[];
    };
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
  },
  itemConfig: ItemConfig
): {
    key: string;
    data: string[];
    bodyPart: {
      [key: string]: Phaser.Geom.Rectangle[];
    };
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
  } {
    switch (cretureType) {
      case CreatureDefinitions.CreatureType.Humanoid:
        return processHumanoidTexture(creatureTexture, itemConfig);
      default:
        break;
    }

    return creatureTexture;
  }

function processHumanoidTexture(
  creatureTexture: {
    key: string;
    data: string[];
    bodyPart: {
      [key: string]: Phaser.Geom.Rectangle[];
    };
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
  },
  itemConfig: ItemConfig
): {
    key: string;
    data: string[];
    bodyPart: {
      [key: string]: Phaser.Geom.Rectangle[];
    };
    textureMargins?: { top: number; right: number; bottom: number; left: number; };
    shadowColor?: string;
  } {
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
