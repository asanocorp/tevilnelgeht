import { Injectable } from '@angular/core';

import { BootScene } from './boot-scene';
import { MainScene } from './main-scene';

/**
 * Scene service. Provides game scenes (that correspond to core game states) to the application.
 */
@Injectable({
  providedIn: 'root'
})
export class SceneService {
  /**
   * Scene types to be provided.
   */
  public static readonly sceneTypes = [BootScene, MainScene];

  /**
   * Scene instances.
   */
  public scenes: Phaser.Scene[];

  /**
   * The game's initial scene key (corresponds to scene in Phaser's scene manager).
   */
  public initialSceneKey: string;

  /**
   * Instantiate scene service.
   *
   * @param boot Boot scene.
   * @param main Game scene.
   */
  public constructor(boot: BootScene, main: MainScene) {
    this.scenes = Array.prototype.slice.call(arguments);
    this.initialSceneKey = boot.sys.config['key'];
  }
}
