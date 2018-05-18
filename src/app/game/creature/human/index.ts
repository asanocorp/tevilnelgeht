import { generateCreature } from '../generate-creature';
import { animations } from './animations';
import * as rules from './rules';
import { textures } from './textures';

export const human = generateCreature('human', textures, animations, rules);
