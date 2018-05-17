import { animations } from './animations';
import { textures } from './textures';

const keyPrefix = 'human-';

const texturesKeyMap = {};
const humanTextures = Object.keys(textures).map(baseKey => {
  const key = keyPrefix + baseKey;
  const texture = { ...textures[baseKey], key };
  texturesKeyMap[baseKey] = key;
  return texture;
});

const animationsKeyMap = {};
const humanAnimations = Object.keys(animations).map(baseKey => {
  const key = keyPrefix + baseKey;
  const config = animations[baseKey];
  const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
  const animation = { ...config, key, frames };
  animationsKeyMap[baseKey] = key;
  return animation;
});

export const human = {
  textures: humanTextures,
  texturesKeyMap,
  animations: humanAnimations,
  animationsKeyMap
};
