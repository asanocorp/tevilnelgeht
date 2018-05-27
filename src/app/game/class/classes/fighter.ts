import { CreatureDefinitions } from '../../creature/creature-definitions';
import { ClassDefinitions } from '../class-definitions';

export const classId = ClassDefinitions.ClassId.Fighter;

export const properName = 'Fighter';

export const properNamePlural = 'Fighters';

export const restrictions = {
  abilities: [
    {
      ability: CreatureDefinitions.CreatureAbility.Strength,
      score: 9,
      bound: CreatureDefinitions.CreatureAbilityBoundType.Minimum
    }
  ]
};

export const hitDie = 8;
