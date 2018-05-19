import { Component, HostListener } from '@angular/core';

import { environment } from '../environments/environment';
import { SceneService } from './game/scene/scene.service';

/**
 * Application component.
 */
@Component({
  selector: 'app-root',
  template: `
    <div id="splash" class="splash"><div id="loadStatus"></div></div>
    <phaser-component [gameConfig]="gameConfig" (gameReady)="onGameReady($event)"></phaser-component>
  `,
  styles: [
    `#loadStatus {
      position: relative;
      top: 128px;
      text-align: center;
      color: #eee;
      font-family: Verdana, sans-serif;
      font-size: 14px;
      font-variant: small-caps;
    }`
  ]
})
export class AppComponent {
  /**
   * Game instance.
   */
  public game: Phaser.Game;

  /**
   * Game configuration.
   */
  public readonly gameConfig: GameConfig = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight
  };

  /**
   * Instantiate application component.
   */
  public constructor(private sceneService: SceneService) { }

  /**
   * Game ready event handler.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
    this.game = game;

    // Add scenes to game & start inital scene.
    this.sceneService.scenes.forEach((scene) => game.scene.add(scene.sys.config['key'], scene));
    game.scene.start(this.sceneService.initialSceneKey);
  }

  /**
   * Window resize event handler.
   *
   * @param event Window resize event.
   */
  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event): void {
    if (this.game) {
      // Resize renderer to match window bounds.
      const target = event.target as Window;
      this.game.renderer.resize(target.innerWidth, target.innerHeight);
    }
  }
}
