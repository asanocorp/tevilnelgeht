import { ClassDefinitions } from '../../../class/class-definitions';

import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Elf;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Elf';

export const properNamePlural = 'Elves';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Intelligence,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    },
    {
      ability: CreatureDefinitions.CreatureAbility.Constitution,
      score: 17,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Maximum
    }
  ],
  classes: [
    ClassDefinitions.ClassId.Cleric,
    ClassDefinitions.ClassId.Fighter,
    ClassDefinitions.ClassId.Mage,
    ClassDefinitions.ClassId.Thief
  ] as string[]
};
