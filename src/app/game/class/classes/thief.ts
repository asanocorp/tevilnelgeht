import { CreatureDefinitions } from '../../creature/creature-definitions';
import { ClassDefinitions } from '../class-definitions';

export const classId = ClassDefinitions.ClassId.Thief;

export const properName = 'Thief';

export const properNamePlural = 'Thieves';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Dexterity,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    }
  ]
};

export const hitDie = 4;
