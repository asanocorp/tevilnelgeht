import { Injectable } from '@angular/core';

import { CreatureService } from '../character/creature/creature.service';

@Injectable({
  providedIn: 'root'
})
export class BootScene extends Phaser.Scene {
  public constructor(private creatureService: CreatureService) {
    super({ key: 'Boot' });
  }

  public preload(): void {
    this.creatureService.loadBaseRenderables(this);
  }

  public create(): void {
    const human = this.creatureService.get('human');
    // this.cameras.main.startFollow(
      this.add.text(125, 50, 'Human');
      this.add.sprite(100, 100, human.texturesKeyMap['idle0']).play(human.animationsKeyMap['walkLeft']); // , false
      this.add.sprite(150, 100, human.texturesKeyMap['idle0']).play(human.animationsKeyMap['idle']); // , false
      this.add.sprite(200, 100, human.texturesKeyMap['idle0']).play(human.animationsKeyMap['walkRight']); // , false
    // );
    console.log(human);

    const elf = this.creatureService.get('elf');
    // this.cameras.main.startFollow(
      this.add.text(325, 50, 'Elf');
      this.add.sprite(300, 100, elf.texturesKeyMap['idle0']).play(elf.animationsKeyMap['walkLeft']); // , false
      this.add.sprite(350, 100, elf.texturesKeyMap['idle0']).play(elf.animationsKeyMap['idle']); // , false
      this.add.sprite(400, 100, elf.texturesKeyMap['idle0']).play(elf.animationsKeyMap['walkRight']); // , false
    // );
    console.log(elf);

    const dwarf = this.creatureService.get('dwarf');
    // this.cameras.main.startFollow(
      this.add.text(525, 50, 'Dwarf');
      this.add.sprite(500, 100, dwarf.texturesKeyMap['idle0']).play(dwarf.animationsKeyMap['walkLeft']); // , false
      this.add.sprite(550, 100, dwarf.texturesKeyMap['idle0']).play(dwarf.animationsKeyMap['idle']); // , false
      this.add.sprite(600, 100, dwarf.texturesKeyMap['idle0']).play(dwarf.animationsKeyMap['walkRight']); // , false
    // );
    console.log(dwarf);

    const halfling = this.creatureService.get('halfling');
    // this.cameras.main.startFollow(
      this.add.text(725, 50, 'Halfling');
      this.add.sprite(700, 100, halfling.texturesKeyMap['idle0']).play(halfling.animationsKeyMap['walkLeft']); // , false
      this.add.sprite(750, 100, halfling.texturesKeyMap['idle0']).play(halfling.animationsKeyMap['idle']); // , false
      this.add.sprite(800, 100, halfling.texturesKeyMap['idle0']).play(halfling.animationsKeyMap['walkRight']); // , false
    // );
    console.log(halfling);
  }
}
