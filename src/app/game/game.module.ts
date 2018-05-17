import { NgModule } from '@angular/core';

import { CharacterModule } from './character/character.module';
import { ClassModule } from './class/class.module';
import { CreatureModule } from './creature/creature.module';
import { SceneModule } from './scene/scene.module';

/**
 * Game module.
 */
@NgModule({
  imports: [ClassModule, CreatureModule, CharacterModule, SceneModule],
})
export class GameModule { }
