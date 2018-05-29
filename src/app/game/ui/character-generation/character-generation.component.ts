import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatRadioChange, MatRadioGroup } from '@angular/material';

import { StoreApi, StoreService } from '../../../core/store.service';
import { UiTransition, uiTransitionInjectionToken } from '../../../ui/ui-transition';

import { ClassService } from '../../class/class.service';
import { CreatureService } from '../../creature/creature.service';
import { DiceRollerMode, DiceRollerService } from '../../dice-roller.service';
import { StoreNamespace } from '../../store-namespace.enum';

@Component({
  selector: 'game-ui-character-generation',
  templateUrl: './character-generation.component.html',
  styleUrls: ['./character-generation.component.scss']
})
export class CharacterGenerationComponent implements OnInit {
  public title = 'Character Generator';

  public abilities = this.creatureService.getAbilities().map(key => ({ label: key, score: undefined }));

  public creatures = this.creatureService.getPlayable().map(c => ({ ...c, label: c.properName, disabled: false }));

  public classes = this.classService.getPlayable().map(c => ({ ...c, label: c.properName, disabled: false }));

  @ViewChildren(MatRadioGroup) private radioGroups: QueryList<MatRadioGroup>;

  public selectedCreature: string;

  private selectedClass: string;

  private abilityDice = this.creatureService.getPlayerAbilityDice();

  public constructor(
    @Inject(uiTransitionInjectionToken) private uiTransitionService: UiTransition,
    private diceRollerService: DiceRollerService,
    private storeService: StoreService,
    private creatureService: CreatureService,
    private classService: ClassService
  ) { }

  public ngOnInit(): void {
    this.diceRollerService.setMode(DiceRollerMode.Discrete);
    this.diceRollerService.sow([Date.now().toString()]);

    this.rollScores();
  }

  public rollScores(): void {
    this.clearRadioGroups();

    this.selectedClass = undefined;
    this.selectedCreature = undefined;

    this.abilities.forEach(ability => ability.score = this.diceRollerService.roll(this.abilityDice));
    this.updateAvailableRadioOptions();
  }

  public creatureChange(change: MatRadioChange): void {
    this.selectedCreature = change.value;
    this.updateAvailableRadioOptions();
  }

  public classChange(change: MatRadioChange): void {
    this.selectedClass = change.value;
  }

  public isReady(): boolean {
    return !!(this.selectedCreature && this.selectedClass);
  }

  public playGame(): void {
    const playerCharacterStore = this.storeService.namespace(StoreNamespace.PlayerCharacter);
    playerCharacterStore.set('creatureId', this.selectedCreature);
    playerCharacterStore.set('classId', this.selectedClass);
    playerCharacterStore.set('classLevel', 1);

    this.uiTransitionService.deactivate();
    (this.uiTransitionService.game.scene.getScene('Main') as any).playTest();
  }

  private clearRadioGroups(): void {
    if (this.radioGroups) {
      this.radioGroups.forEach(group => group.selected = null);
    }
  }

  private updateAvailableRadioOptions(): void {
    this.creatures.forEach(creature => {
      const abilities = creature.restrictions.abilities;

      for (let i = 0, len = abilities.length; i < len; ++i) {
        const abilityRestriction = abilities[i];
        const ability = this.abilities.find(a => a.label === abilityRestriction.ability);

        if (abilityRestriction.bound === this.creatureService.CreatureAbilityBoundType.Maximum) {
          creature.disabled = ability.score > abilityRestriction.score;
        } else if (abilityRestriction.bound === this.creatureService.CreatureAbilityBoundType.Minimum) {
          creature.disabled = ability.score < abilityRestriction.score;
        }

        if (creature.disabled) {
          break;
        }
      }
    });

    this.classes.forEach(classConfig => {
      const abilities = classConfig.restrictions.abilities;

      if (this.selectedCreature) {
        this.selectedClass = undefined;

        if (this.radioGroups) {
          this.radioGroups.find(group => group.name === 'class').selected = null;
        }

        const creature = this.creatures.find((c) => c.creatureId === this.selectedCreature);
        if (!creature.restrictions.classes.includes(classConfig.classId)) {
          classConfig.disabled = true;
          return;
        }
      }

      for (let i = 0, len = abilities.length; i < len; ++i) {
        const abilityRestriction = abilities[i];
        const ability = this.abilities.find(a => a.label === abilityRestriction.ability);

        if (abilityRestriction.bound === this.creatureService.CreatureAbilityBoundType.Maximum) {
          classConfig.disabled = ability.score > abilityRestriction.score;
        } else if (abilityRestriction.bound === this.creatureService.CreatureAbilityBoundType.Minimum) {
          classConfig.disabled = ability.score < abilityRestriction.score;
        }

        if (classConfig.disabled) {
          break;
        }
      }
    });
  }
}
