import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Halfling;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Halfling';

export const properNamePlural = 'Halflings';

export const restrictions = {
  abilities: [
    {
      ability: 'Dexterity',
      score: 9,
      bound: 'minimum'
    },
    {
      ability: 'Strength',
      score: 17,
      bound: 'maximum'
    }
  ],
  classes: ['fighter', 'cleric', 'thief']
};
