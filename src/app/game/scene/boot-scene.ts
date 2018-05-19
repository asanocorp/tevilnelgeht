import { Injectable } from '@angular/core';

import { CharacterService } from '../character/character.service';
import { CreatureService } from '../creature/creature.service';
import { TerrainService } from '../terrain/terrain.service';

@Injectable({
  providedIn: 'root'
})
export class BootScene extends Phaser.Scene {
  public constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private terrainService: TerrainService
  ) {
    super({ key: 'Boot' });
  }

  public preload(): void {
    this.creatureService.loadBaseRenderables(this);
    this.terrainService.loadTerrainTileset(this);
  }

  public create(): void {
    this.splashFadeOut();

    this.textures.generate('colorBar', { data: ['0123456789ABCDEF'], pixelWidth: 16, pixelHeight: 16 });
    this.add.image(300, 32, 'colorBar');

    this.add.text(125, 50, 'Human');

    let human = this.characterService.generate('human', {}, this);
    human.setPosition(100, 100);
    human.play('walkLeft');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);

    human = this.characterService.generate('human', {}, this);
    human.setPosition(150, 100);
    human.play('idle');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);

    human = this.characterService.generate('human', {}, this);
    human.setPosition(200, 100);
    human.play('walkRight');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);

    this.add.text(325, 50, 'Elf');

    let elf = this.characterService.generate('elf', {}, this);
    elf.setPosition(300, 100);
    elf.play('walkLeft');
    this.sys.displayList.add(elf);
    this.sys.updateList.add(elf);

    elf = this.characterService.generate('elf', {}, this);
    elf.setPosition(350, 100);
    elf.play('idle');
    this.sys.displayList.add(elf);
    this.sys.updateList.add(elf);

    elf = this.characterService.generate('elf', {}, this);
    elf.setPosition(400, 100);
    elf.play('walkRight');
    this.sys.displayList.add(elf);
    this.sys.updateList.add(elf);

    this.add.text(525, 50, 'Dwarf');

    let dwarf = this.characterService.generate('dwarf', {}, this);
    dwarf.setPosition(500, 100);
    dwarf.play('walkLeft');
    this.sys.displayList.add(dwarf);
    this.sys.updateList.add(dwarf);

    dwarf = this.characterService.generate('dwarf', {}, this);
    dwarf.setPosition(550, 100);
    dwarf.play('idle');
    this.sys.displayList.add(dwarf);
    this.sys.updateList.add(dwarf);

    dwarf = this.characterService.generate('dwarf', {}, this);
    dwarf.setPosition(600, 100);
    dwarf.play('walkRight');
    this.sys.displayList.add(dwarf);
    this.sys.updateList.add(dwarf);

    this.add.text(725, 50, 'Halfling');

    let halfling = this.characterService.generate('halfling', {}, this);
    halfling.setPosition(700, 100);
    halfling.play('walkLeft');
    this.sys.displayList.add(halfling);
    this.sys.updateList.add(halfling);

    halfling = this.characterService.generate('halfling', {}, this);
    halfling.setPosition(750, 100);
    halfling.play('idle');
    this.sys.displayList.add(halfling);
    this.sys.updateList.add(halfling);

    halfling = this.characterService.generate('halfling', {}, this);
    halfling.setPosition(800, 100);
    halfling.play('walkRight');
    this.sys.displayList.add(halfling);
    this.sys.updateList.add(halfling);

    const map = this.make.tilemap({
      tileWidth: this.terrainService.tileWidth, tileHeight: this.terrainService.tileHeight, width: 4, height: 4
    });
    const tileset = map.addTilesetImage('terrain');
    const layer = map.createBlankDynamicLayer('Layer 1', tileset, undefined, undefined, undefined, undefined);
    layer.x = 100;
    layer.y = 300;

    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, 0);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 1, 0);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 2, 0);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 3, 0);

    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, 1);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'floor'), 1, 1);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'floor'), 2, 1);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 3, 1);

    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 0, 2);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'floor'), 1, 2);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'floor'), 2, 2);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallTop'), 3, 2);

    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 0, 3);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 1, 3);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 2, 3);
    map.putTileAt(this.terrainService.getTileIndex('dungeon', 'wallBottom'), 3, 3);

    human = this.characterService.generate('human', {}, this);
    human.setPosition(148 + 24, 348 + 24);
    human.play('idle');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);

    human = this.characterService.generate('human', {}, this);
    human.setPosition(172, 420);
    human.play('idle');
    this.sys.displayList.add(human);
    this.sys.updateList.add(human);
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
