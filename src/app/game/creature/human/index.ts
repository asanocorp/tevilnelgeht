import { generateCreature } from '../generate-creature';
import { animations } from './animations';
import { textures } from './textures';

export const human = generateCreature('human', textures, animations);
