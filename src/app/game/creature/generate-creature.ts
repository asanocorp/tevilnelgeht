export function generateCreature(creatureKey: string, texturesIndex: any, animationsIndex: any): any {
  const keyPrefix = creatureKey + '-';

  const texturesKeyMap = {};
  const textures = Object.keys(texturesIndex).map(baseKey => {
    const key = keyPrefix + baseKey;
    const texture = { ...texturesIndex[baseKey], key };
    texturesKeyMap[baseKey] = key;
    return texture;
  });

  const animationsKeyMap = {};
  const animations = Object.keys(animationsIndex).map(baseKey => {
    const key = keyPrefix + baseKey;
    const config = animationsIndex[baseKey];
    const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
    const animation = { ...config, key, frames };
    animationsKeyMap[baseKey] = key;
    return animation;
  });

  return {
    defaultTexture: textures[0].key,
    textures,
    texturesKeyMap,
    animations,
    animationsKeyMap
  };
}
