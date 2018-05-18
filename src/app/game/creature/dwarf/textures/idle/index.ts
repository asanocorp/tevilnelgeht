import { generateCreatureTexture } from '../../../generate-creature-texture';
import * as rules from '../../rules';
import * as frame0 from './frame0';
import * as frame1 from './frame1';

export const idleTextures = {
  idle0: generateCreatureTexture(frame0, rules),
  idle1: generateCreatureTexture(frame1, rules),
};
