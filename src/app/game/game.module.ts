import { NgModule } from '@angular/core';

import { CharacterModule } from './character/character.module';
import { SceneModule } from './scene/scene.module';

/**
 * Game module.
 */
@NgModule({
  imports: [CharacterModule, SceneModule],
})
export class GameModule { }
