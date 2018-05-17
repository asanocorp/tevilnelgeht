import { Injectable } from '@angular/core';

import { BootScene } from './boot-scene';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  public static readonly sceneTypes = [BootScene];

  public scenes: Phaser.Scene[];

  public initialSceneKey: string;

  public constructor(boot: BootScene) {
    this.scenes = Array.prototype.slice.call(arguments);
    this.initialSceneKey = boot.sys.config['key'];
  }
}
