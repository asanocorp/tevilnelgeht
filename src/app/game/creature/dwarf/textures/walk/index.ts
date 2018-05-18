import { generateCreatureTexture } from '../../../generate-creature-texture';
import * as rules from '../../rules';
import * as frame0 from './frame0';
import * as frame1 from './frame1';
import * as frame2 from './frame2';
import * as frame3 from './frame3';

export const walkTextures = {
  walk0: generateCreatureTexture(frame0, rules),
  walk1: generateCreatureTexture(frame1, rules),
  walk2: generateCreatureTexture(frame2, rules),
  walk3: generateCreatureTexture(frame3, rules),
};
