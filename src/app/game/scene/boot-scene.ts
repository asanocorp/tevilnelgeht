import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { CreatureService } from '../creature/creature.service';
import { ItemService } from '../item/item.service';
import { TerrainService } from '../terrain/terrain.service';

/**
 * Boot scene. Responsible for loading game resources & splash image display.
 */
@Injectable({
  providedIn: 'root'
})
export class BootScene extends Phaser.Scene {
  /**
   * Instantiate boot scene.
   *
   * @param creatureService Creature service; load base renderables.
   * @param terrainService Terrain service; load terrain tileset.
   * @param itemService Item service; load base renderables.
   */
  public constructor(private creatureService: CreatureService, private terrainService: TerrainService, private itemService: ItemService) {
    super({ key: 'Boot' });
  }

  /**
   * Load game resources.
   */
  public preload(): void {
    const textConfig = { fontSize: '14px', fontFamily: 'Palatino Linotype', color: '#eee', align: 'center' };
    const textZone = this.add.zone(0, 0, this.sys.game.renderer.width - 28, this.sys.game.renderer.height - 28);

    Phaser.Display.Align.In.BottomLeft(
      this.add.text(0, 0, environment.title + '\nv' + environment.version, textConfig),
      textZone
    );

    Phaser.Display.Align.In.BottomRight(
      this.add.text(0, 0, 'Copyright © 2018  Tristan Bonsor', textConfig),
      textZone
    );

    this.creatureService.loadBaseRenderables(this);
    this.terrainService.loadTerrainTileset(this);
    this.itemService.loadBaseRenderables(this);
  }

  /**
   * Called once game resources are loaded. Display prompt to begin user initiated interaction.
   */
  public create(): void {
    this.splashFadeOut();

    const textConfig = { fontSize: '20px', fontFamily: 'Palatino Linotype', color: '#ffd700', align: 'center' };
    const text = this.add.text(0, 0, 'Click to Start', textConfig);

    const textBlink = () => {
      text.setVisible(!text.visible);
      this.time.delayedCall(1000, textBlink, undefined, undefined);
    };

    text.setOrigin(0.5);
    this.cameras.main.startFollow(text, false);
    textBlink();

    this.input.once('pointerdown', () => {
      this.scene.start('Main');
    });
  }

  /**
   * Fade out the splash image.
   */
  private splashFadeOut(): void {
    const duration = 1000;
    const beginOpacity = 0.9;
    const endOpacity = 0;

    const splashFadeOutPromise = new Promise(function (resolve) {
      let splashFadeOutStartTime;

      function stepSplashFadeOut(time) {
        if (!splashFadeOutStartTime) {
          splashFadeOutStartTime = time;
        }

        const opacity = beginOpacity - ((time - splashFadeOutStartTime) / duration);

        document.getElementById('splash').style.opacity = Math.max(opacity, endOpacity).toString();

        if (opacity > endOpacity) {
          window.requestAnimationFrame(stepSplashFadeOut);
        } else {
          resolve();
        }
      }

      window.requestAnimationFrame(stepSplashFadeOut);
    });

    splashFadeOutPromise.then(function () {
      document.getElementById('splash').outerHTML = '';
    });
  }
}
