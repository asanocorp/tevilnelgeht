import { Injectable } from '@angular/core';

import { BootScene } from './boot-scene';
import { MainScene } from './main-scene';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  public static readonly sceneTypes = [BootScene, MainScene];

  public scenes: Phaser.Scene[];

  public initialSceneKey: string;

  public constructor(boot: BootScene, main: MainScene) {
    this.scenes = Array.prototype.slice.call(arguments);
    this.initialSceneKey = boot.sys.config['key'];
  }
}
