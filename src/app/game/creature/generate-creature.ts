import { CreatureDefinitions } from './creature-definitions';

export function generateCreature(creatureKey: string, texturesIndex: any, animationsIndex: any, rules: any): any {
  const keyPrefix = creatureKey + '-';

  const texturesKeyMap = {};
  const textures = Object.keys(texturesIndex).map(baseKey => {
    const key = keyPrefix + baseKey;
    texturesKeyMap[baseKey] = key;
    return { ...texturesIndex[baseKey], key };
  });

  const animationsKeyMap = {};
  const animations = Object.keys(animationsIndex).map(baseKey => {
    const key = keyPrefix + baseKey;
    animationsKeyMap[baseKey] = key;
    const config = animationsIndex[baseKey];
    const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
    return { ...config, key, frames };
  });

  return {
    origin: { ...CreatureDefinitions.creatureTypes[rules.creatureType].textureOrigin },
    defaultTexture: textures[0].key,
    textures,
    texturesKeyMap,
    animations,
    animationsKeyMap,
    rules: { ...rules }
  };
}
