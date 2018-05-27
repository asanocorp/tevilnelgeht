import { ClassDefinitions } from '../../../class/class-definitions';

import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Human;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Human';

export const properNamePlural = 'Humans';

export const restrictions = {
  abilities: [],
  classes: [
    ClassDefinitions.ClassId.Cleric,
    ClassDefinitions.ClassId.Fighter,
    ClassDefinitions.ClassId.Mage,
    ClassDefinitions.ClassId.Thief
  ] as string[]
};
