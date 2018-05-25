import { NgModule } from '@angular/core';

import { CharacterModule } from './character/character.module';
import { ClassModule } from './class/class.module';
import { CreatureModule } from './creature/creature.module';
import { DiceRollerService } from './dice-roller.service';
import { ItemModule } from './item/item.module';
import { LevelModule } from './level/level.module';
import { SceneModule } from './scene/scene.module';
import { TerrainModule } from './terrain/terrain.module';
import { TextureModule } from './texture/texture.module';
import { UiModule } from './ui/ui.module';


/**
 * Game module.
 */
@NgModule({
  imports: [ClassModule, CreatureModule, CharacterModule, LevelModule, SceneModule, TerrainModule, TextureModule, UiModule],
  providers: [DiceRollerService]
})
export class GameModule { }
