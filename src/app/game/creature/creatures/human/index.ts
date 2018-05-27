import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Human;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Human';

export const properNamePlural = 'Humans';

export const restrictions = {
  abilities: [],
  classes: ['fighter', 'cleric', 'thief', 'mage']
};
