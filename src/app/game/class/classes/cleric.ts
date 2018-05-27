import { CreatureDefinitions } from '../../creature/creature-definitions';
import { ClassDefinitions } from '../class-definitions';

export const classId = ClassDefinitions.ClassId.Cleric;

export const properName = 'Cleric';

export const properNamePlural = 'Clerics';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Wisdom,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    }
  ]
};

export const hitDie = 6;
