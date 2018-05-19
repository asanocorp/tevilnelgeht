import { NgModule } from '@angular/core';

import { CharacterModule } from './character/character.module';
import { ClassModule } from './class/class.module';
import { CreatureModule } from './creature/creature.module';
import { LevelModule } from './level/level.module';
import { SceneModule } from './scene/scene.module';
import { TerrainModule } from './terrain/terrain.module';
import { TextureModule } from './texture/texture.module';

/**
 * Game module.
 */
@NgModule({
  imports: [ClassModule, CreatureModule, CharacterModule, LevelModule, SceneModule, TerrainModule, TextureModule],
})
export class GameModule { }
