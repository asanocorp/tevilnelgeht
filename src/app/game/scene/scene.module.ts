import { NgModule } from '@angular/core';

import { SceneService } from './scene.service';

/**
 * Scene module.
 */
@NgModule({
  providers: [SceneService, SceneService.sceneTypes]
})
export class SceneModule { }
