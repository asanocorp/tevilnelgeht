import { Injectable } from '@angular/core';

import { StoreService } from '../../core/store.service';

import { ModalService } from '../../ui/modal/modal.service';

import { Character } from '../character/character';
import { CharacterService } from '../character/character.service';
import { LevelService } from '../level/level.service';
import { MainMenuComponent } from '../ui/main-menu/main-menu.component';

/**
 * Main scene. Root host for game play functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class MainScene extends Phaser.Scene {
  /**
   * Player character.
   */
  private playerCharacter: Character;

  /**
   * Instantiate main scene.
   *
   * @param characterService Character service.
   * @param levelService Level service.
   */
  public constructor(
    private characterService: CharacterService,
    private levelService: LevelService,
    private modalService: ModalService,
    private storeService: StoreService
  ) {
    super({ key: 'Main' });
  }

  /**
   * Create & display main game play components; begin game.
   */
  public create(): void {
    this.modalService.transitionUi('main-menu', MainMenuComponent);
  }

  public playTest(): void {
    const levelKey = this.storeService.get('currentLevel', 'dungeon');

    const level = this.levelService.load(levelKey);
    this.scene.add(level.sys.settings.key, level, false);
    this.scene.launch(level.sys.settings.key);

    let playerConfig;

    if (this.storeService.get('continueGame', false)) {
      playerConfig = this.storeService.get('pcData', undefined);

      if (playerConfig) {
        this.playerCharacter = this.characterService.generate(
          playerConfig.creatureId,
          playerConfig.classConfig,
          playerConfig.inventoryConfig,
          this
        );
      }
    }

    if (playerConfig === undefined) {
      this.playerCharacter = this.characterService.generate(
        'human',
        { classId: 'fighter', level: 1 },
        [
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
        ],
        this
      );
    }

    level.attachPlayerCharacter(this.playerCharacter);

    // Attach player sprite input listeners...

    // Required so player sprite remains interactive when attached to a level.
    this.scene.bringToTop('Main');
  }
}
