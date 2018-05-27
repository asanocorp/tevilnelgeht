import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Dwarf;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Dwarf';

export const properNamePlural = 'Dwarves';

export const restrictions = {
  abilities: [
    {
      ability: 'Constitution',
      score: 9,
      bound: 'minimum'
    },
    {
      ability: 'Charisma',
      score: 17,
      bound: 'maximum'
    }
  ],
  classes: ['fighter', 'cleric', 'thief']
};
