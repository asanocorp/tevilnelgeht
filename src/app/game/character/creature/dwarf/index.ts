import { animations } from './animations';
import { textures } from './textures';

const keyPrefix = 'dwarf-';

const texturesKeyMap = {};
const dwarfTextures = Object.keys(textures).map(baseKey => {
  const key = keyPrefix + baseKey;
  const texture = { ...textures[baseKey], key };
  texturesKeyMap[baseKey] = key;
  return texture;
});

const animationsKeyMap = {};
const dwarfAnimations = Object.keys(animations).map(baseKey => {
  const key = keyPrefix + baseKey;
  const config = animations[baseKey];
  const frames = config.frames.map(frame => ({ key: keyPrefix + frame.key }));
  const animation = { ...config, key, frames };
  animationsKeyMap[baseKey] = key;
  return animation;
});

export const dwarf = {
  textures: dwarfTextures,
  texturesKeyMap,
  animations: dwarfAnimations,
  animationsKeyMap
};
