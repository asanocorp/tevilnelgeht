import { ClassDefinitions } from '../../../class/class-definitions';

import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Halfling;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Halfling';

export const properNamePlural = 'Halflings';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Dexterity,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    },
    {
      ability: CreatureDefinitions.CreatureAbility.Strength,
      score: 17,
      bound: CreatureDefinitions.CreatureAbilityBoundType
    }
  ],
  classes: [
    ClassDefinitions.ClassId.Cleric,
    ClassDefinitions.ClassId.Fighter,
    ClassDefinitions.ClassId.Thief
  ] as string[]
};
