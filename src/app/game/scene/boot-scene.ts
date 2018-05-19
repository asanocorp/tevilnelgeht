import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CreatureService } from '../creature/creature.service';
import { TerrainService } from '../terrain/terrain.service';

@Injectable({
  providedIn: 'root'
})
export class BootScene extends Phaser.Scene {
  public constructor(private creatureService: CreatureService, private terrainService: TerrainService) {
    super({ key: 'Boot' });
  }

  public preload(): void {
    this.creatureService.loadBaseRenderables(this);
    this.terrainService.loadTerrainTileset(this);
  }

  public create(): void {
    this.splashFadeOut();



    this.time.delayedCall(
      1500,
      () => {
        const title = this.add.text(
          0,
          0,
          environment.title + '\nv' + environment.version,
          { fontSize: '24px', fontFamily: 'Palatino Linotype', color: '#ddd', align: 'center' }
        );
        title.setOrigin(0.5);

        const text = this.add.text(
          0,
          150,
          'Click to Start',
          { fontSize: '20px', fontFamily: 'Palatino Linotype', color: '#ffd700', align: 'center' }
        );
        text.setOrigin(0.5);

        const textBlink = () => {
          text.setVisible(!text.visible);
          this.time.delayedCall(1000, textBlink, undefined, undefined);
        };

        this.cameras.main.startFollow(title, false);
        textBlink();

        this.input.once('pointerdown', () => {
          this.scene.start('Main');
        });
      },
      undefined,
      undefined
    );
  }

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
