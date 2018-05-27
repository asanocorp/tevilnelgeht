import { CreatureDefinitions } from '../../creature-definitions';

export { textures } from './textures';

export const creatureId = CreatureDefinitions.CreatureId.Elf;

export const creatureType = CreatureDefinitions.CreatureType.Humanoid;

export const properName = 'Elf';

export const properNamePlural = 'Elves';

export const restrictions = {
  abilities: [
    {
      ability: 'Intelligence',
      score: 9,
      bound: 'minimum'
    },
    {
      ability: 'Constitution',
      score: 17,
      bound: 'maximum'
    }
  ],
  classes: ['fighter', 'cleric', 'thief', 'mage']
};
