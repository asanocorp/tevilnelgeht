import { CreatureDefinitions } from '../creature-definitions';

import { CreatureConfig } from '../creature-config';

import { CreatureBaseConfig } from './creature-base-config';
import { CreatureBaseTextureConfig } from './creature-base-texture-config';

/**
 * Creature configurations.
 */
export const creatures = {};

// Generate creature configurations.
Object.keys(CreatureDefinitions.CreatureId)
  // Parse creature ID enumerations.
  .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); })
  // Map enumeration to creature ID.
  .map(key => CreatureDefinitions.CreatureId[key])
  // Use creature ID to locate data.
  .forEach(creatureId => creatures[creatureId] = generateCreatureConfig(require('./' + creatureId)));

/**
 * Generate creature configuration.
 *
 * @param base Base creature configuration.
 */
function generateCreatureConfig(base: CreatureBaseConfig): CreatureConfig {
  const creatureDefaults = CreatureDefinitions.defaultValuesByCreatureType[base.creatureType];
  const keyPrefix = base.creatureId + '-';

  const textureOrigin = base.textureOrigin || creatureDefaults.textureOrigin;

  const texturesKeyMap = {};
  const textures = Object.keys(base.textures).map(baseKey => {
    const key = keyPrefix + baseKey;
    texturesKeyMap[baseKey] = key;
    return { ...processCreatureBaseTextureConfig(base.textures[baseKey], base), key };
  });

  const baseAnimations = base.animationConfigs || creatureDefaults.animationConfigs;

  const animationKeys = [];
  const animationsKeyMap = {};
  const animations = Object.keys(baseAnimations).filter(baseKey => creatureDefaults.animationKeys.includes(baseKey)).map(baseKey => {
    const key = keyPrefix + baseKey;
    animationKeys.push(baseKey);
    animationsKeyMap[baseKey] = key;
    const config = creatureDefaults.animationConfigs[baseKey];
    const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
    return { ...config, key, frames };
  });

  const itemEquipSlotRenderOrder = base.itemEquipSlotRenderOrder || creatureDefaults.itemEquipSlotRenderOrder;

  const bodyPartTree = base.bodyPartTree || creatureDefaults.bodyPartTree;

  const abilityDice = {};
  Object.keys(CreatureDefinitions.CreatureAbility)
    .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); })
    .map(key => abilityDice[key] = base.abilityDice ? base.abilityDice[key] : creatureDefaults.abilityDice);

  return {
    ...base,
    abilityDice,
    defaultTexture: textures[0].key,
    textureOrigin,
    textures,
    texturesKeyMap,
    defaultAnimation: animations[0].key,
    animationConfigs: baseAnimations,
    animationKeys,
    animations,
    animationsKeyMap,
    itemEquipSlotRenderOrder,
    bodyPartTree
  };
}

/**
 * Process creature's base texture configuration.
 *
 * @param texture Base texture configuration.
 * @param base Base creature configuration.
 */
function processCreatureBaseTextureConfig(texture: CreatureBaseTextureConfig, base: CreatureBaseConfig): CreatureBaseTextureConfig {
  const creatureDefaults = CreatureDefinitions.defaultValuesByCreatureType[base.creatureType];

  const data = [];
  const bodyPart = {};
  const shadowColor = texture.shadowColor || creatureDefaults.shadowColor;
  const margins = texture.textureMargins || creatureDefaults.textureMargins;

  for (let y = 0; y < margins.top; ++y) {
    data.push('.'.repeat(texture.data[0].length + margins.left + margins.right));
  }

  texture.data.forEach(row => data.push('.'.repeat(margins.left) + row + '.'.repeat(margins.right)));

  for (let y = 0; y < margins.bottom; ++y) {
    data.push('.'.repeat(texture.data[0].length + margins.left + margins.right));
  }

  Object.keys(texture.bodyPart).forEach(bodyPartKey => {
    const Rect = Phaser.Geom.Rectangle;
    bodyPart[bodyPartKey] = texture.bodyPart[bodyPartKey].map(
      rect => Rect.Clone(rect).setPosition(margins.left + rect.x, margins.top + rect.y)
    );
  });

  return { data, bodyPart, textureMargins: margins, shadowColor };
}
