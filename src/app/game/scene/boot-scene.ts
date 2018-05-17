import { Injectable } from '@angular/core';

import { CharacterService } from '../character/character.service';
import { CreatureService } from '../creature/creature.service';

@Injectable({
  providedIn: 'root'
})
export class BootScene extends Phaser.Scene {
  public constructor(private creatureService: CreatureService, private characterService: CharacterService) {
    super({ key: 'Boot' });
  }

  public preload(): void {
    this.creatureService.loadBaseRenderables(this);
  }

  public create(): void {
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
  }
}
