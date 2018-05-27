import { CreatureDefinitions } from '../../creature/creature-definitions';
import { ClassDefinitions } from '../class-definitions';

export const classId = ClassDefinitions.ClassId.Mage;

export const properName = 'Mage';

export const properNamePlural = 'Magi';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Intelligence,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    }
  ]
};

export const hitDie = 4;
