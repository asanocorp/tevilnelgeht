import { NgModule } from '@angular/core';

import { SceneService } from './scene.service';

@NgModule({
  providers: [SceneService, SceneService.sceneTypes]
})
export class SceneModule { }
