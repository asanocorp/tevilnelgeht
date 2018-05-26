import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatRadioChange, MatRadioGroup } from '@angular/material';

import { StoreApi, StoreService } from '../../../core/store.service';
import { UiTransition, uiTransitionInjectionToken } from '../../../ui/ui-transition';

import { DiceRollerMode, DiceRollerService } from '../../dice-roller.service';
import { StoreNamespace } from '../../store-namespace.enum';

@Component({
  selector: 'game-ui-character-generation',
  templateUrl: './character-generation.component.html',
  styleUrls: ['./character-generation.component.scss']
})
export class CharacterGenerationComponent implements OnInit {
  public title = 'Character Generator';

  public abilities = [
    { label: 'Strength', score: undefined },
    { label: 'Dexterity', score: undefined },
    { label: 'Constitution', score: undefined },
    { label: 'Intelligence', score: undefined },
    { label: 'Wisdom', score: undefined },
    { label: 'Charisma', score: undefined }
  ];

  public creatures = [
    {
      label: 'Dwarf',
      creatureId: 'dwarf',
      restrictions: {
        abilities: [
          {
            ability: 'Constitution',
            score: 9,
            bound: 'minimum'
          },
          {
            ability: 'Charisma',
            score: 17,
            bound: 'maximum'
          }
        ],
        classes: ['fighter', 'cleric', 'thief']
      },
      disabled: false
    },
    {
      label: 'Elf',
      creatureId: 'elf',
      restrictions: {
        abilities: [
          {
            ability: 'Intelligence',
            score: 9,
            bound: 'minimum'
          },
          {
            ability: 'Constitution',
            score: 17,
            bound: 'maximum'
          }
        ],
        classes: ['fighter', 'cleric', 'thief', 'mage']
      },
      disabled: false
    },
    {
      label: 'Halfling',
      creatureId: 'halfling',
      restrictions: {
        abilities: [
          {
            ability: 'Dexterity',
            score: 9,
            bound: 'minimum'
          },
          {
            ability: 'Strength',
            score: 17,
            bound: 'maximum'
          }
        ],
        classes: ['fighter', 'cleric', 'thief']
      },
      disabled: false
    },
    {
      label: 'Human',
      creatureId: 'human',
      restrictions: {
        abilities: [],
        classes: ['fighter', 'cleric', 'thief', 'mage']
      },
      disabled: false
    }
  ];

  public classes = [
    {
      label: 'Cleric',
      classId: 'cleric',
      restrictions: {
        abilities: [
          {
            ability: 'Wisdom',
            score: 9,
            bound: 'minimum'
          }
        ]
      },
      disabled: false
    },
    {
      label: 'Fighter',
      classId: 'fighter',
      restrictions: {
        abilities: [
          {
            ability: 'Strength',
            score: 9,
            bound: 'minimum'
          }
        ]
      },
      disabled: false
    },
    {
      label: 'Mage',
      classId: 'mage',
      restrictions: {
        abilities: [
          {
            ability: 'Intelligence',
            score: 9,
            bound: 'minimum'
          }
        ]
      },
      disabled: false
    },
    {
      label: 'Thief',
      classId: 'thief',
      restrictions: {
        abilities: [
          {
            ability: 'Dexterity',
            score: 9,
            bound: 'minimum'
          }
        ]
      },
      disabled: false
    }
  ];

  @ViewChildren(MatRadioGroup) private radioGroups: QueryList<MatRadioGroup>;

  private selectedCreature: string;

  private selectedClass: string;

  public constructor(
    @Inject(uiTransitionInjectionToken) private uiTransitionService: UiTransition,
    private diceRollerService: DiceRollerService,
    private storeService: StoreService
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

    this.abilities.forEach(ability => ability.score = this.diceRollerService.roll('3d6'));
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
    playerCharacterStore.set('classConfig', { classId: this.selectedClass, level: 1 });
    playerCharacterStore.set('inventoryConfig', [
      { key: 'boots', equipped: 'feet' },
      { key: 'gloves', equipped: 'hands' },
      { key: 'pants', equipped: 'legs' },
      { key: 'shirt', equipped: 'torso' },
      { key: 'amulet', equipped: 'neck' },
      { key: 'belt', equipped: 'waist' },
      { key: 'cap', equipped: 'head' },
      { key: 'pauldrons', equipped: 'shoulders' },
      { key: 'gold-ring', equipped: 'rightFinger' },
      { key: 'silver-ring', equipped: 'leftFinger' },
    ]);

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

        if (abilityRestriction.bound === 'maximum') {
          creature.disabled = ability.score > abilityRestriction.score;
        } else if (abilityRestriction.bound === 'minimum') {
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
        const creature = this.creatures.find((c) => c.creatureId === this.selectedCreature);
        if (!creature.restrictions.classes.includes(classConfig.classId)) {
          this.selectedClass = undefined;
          classConfig.disabled = true;

          if (this.radioGroups) {
            this.radioGroups.find(group => group.name === 'class').selected = null;
          }

          return;
        }
      }

      for (let i = 0, len = abilities.length; i < len; ++i) {
        const abilityRestriction = abilities[i];
        const ability = this.abilities.find(a => a.label === abilityRestriction.ability);

        if (abilityRestriction.bound === 'maximum') {
          classConfig.disabled = ability.score > abilityRestriction.score;
        } else if (abilityRestriction.bound === 'minimum') {
          classConfig.disabled = ability.score < abilityRestriction.score;
        }

        if (classConfig.disabled) {
          break;
        }
      }
    });
  }
}
