import { ClassDefinitions } from '../../../class/class-definitions';

import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Dwarf;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Dwarf';

export const properNamePlural = 'Dwarves';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Constitution,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    },
    {
      ability: CreatureDefinitions.CreatureAbility.Charisma,
      score: 17,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Maximum
    }
  ],
  classes: [
    ClassDefinitions.ClassId.Cleric,
    ClassDefinitions.ClassId.Fighter,
    ClassDefinitions.ClassId.Thief
  ] as string[]
};
