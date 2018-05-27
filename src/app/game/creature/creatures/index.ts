import { CreatureDefinitions } from '../creature-definitions';

export const creatures = {};

Object.keys(CreatureDefinitions.CreatureId)
  .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); })
  .map(key => CreatureDefinitions.CreatureId[key])
  .forEach(creatureId => creatures[creatureId] = generateCreatureConfig(require('./' + creatureId)));

function generateCreatureConfig(base: any): any {
  const creatureDefaults = CreatureDefinitions.defaultValuesByCreatureType[base.creatureType];
  const keyPrefix = base.creatureId + '-';

  const textureOrigin = base.textureOrigin || creatureDefaults.textureOrigin;

  const texturesKeyMap = {};
  const textures = Object.keys(base.textures).map(baseKey => {
    const key = keyPrefix + baseKey;
    texturesKeyMap[baseKey] = key;
    return { ...generateCreatureTextureConfig(base.textures[baseKey], base), key };
  });

  const baseAnimations = base.animationConfigs || creatureDefaults.animationConfigs;

  const animationKeys = [];
  const animationsKeyMap = {};
  const animations = Object.keys(baseAnimations).filter(baseKey => creatureDefaults.animationKeys.includes(baseKey as any)).map(baseKey => {
    const key = keyPrefix + baseKey;
    animationKeys.push(baseKey);
    animationsKeyMap[baseKey] = key;
    const config = creatureDefaults.animationConfigs[baseKey];
    const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
    return { ...config, key, frames };
  });

  return {
    ...base,
    defaultTexture: textures[0].key,
    textureOrigin,
    textures,
    texturesKeyMap,
    defaultAnimation: animations[0].key,
    animationKeys,
    animations,
    animationsKeyMap
  };
}

function generateCreatureTextureConfig(texture: any, base: any): any {
  const creatureDefaults = CreatureDefinitions.defaultValuesByCreatureType[base.creatureType];

  const data = [];
  const sockets = {};
  const shadowColor = texture.shadowColor || creatureDefaults.shadowColor;
  const margins = texture.textureMargins || creatureDefaults.textureMargins;

  for (let y = 0; y < margins.top; ++y) {
    data.push('.'.repeat(texture.data[0].length + margins.left + margins.right));
  }

  texture.data.forEach(row => data.push('.'.repeat(margins.left) + row + '.'.repeat(margins.right)));

  for (let y = 0; y < margins.bottom; ++y) {
    data.push('.'.repeat(texture.data[0].length + margins.left + margins.right));
  }

  Object.keys(texture.sockets).forEach(socketKey => {
    const Rect = Phaser.Geom.Rectangle;
    sockets[socketKey] = texture.sockets[socketKey].map(rect => Rect.Clone(rect).setPosition(margins.left + rect.x, margins.top + rect.y));
  });

  return { data, sockets, shadowColor };
}
