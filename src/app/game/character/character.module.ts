import { NgModule } from '@angular/core';

import { CreatureModule } from './creature/creature.module';

@NgModule({
  imports: [CreatureModule],
  exports: [CreatureModule]
})
export class CharacterModule { }
