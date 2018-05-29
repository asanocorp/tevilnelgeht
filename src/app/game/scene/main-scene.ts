import { Injectable } from '@angular/core';

import { StoreService } from '../../core/store.service';

import { ModalService } from '../../ui/modal/modal.service';

import { Character } from '../character/character';
import { CharacterService } from '../character/character.service';
import { LevelService } from '../level/level.service';
import { StoreNamespace } from '../store-namespace.enum';
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
    const levelKey = this.storeService.namespace(StoreNamespace.Level).get('currentLevel', 'dungeon');

    const level = this.levelService.load(levelKey);
    this.scene.add(level.sys.settings.key, level, false);
    this.scene.launch(level.sys.settings.key);

    const playerCharacterStore = this.storeService.namespace(StoreNamespace.PlayerCharacter);
    const creatureId = playerCharacterStore.get('creatureId');
    const classId = playerCharacterStore.get('classId');
    const classLevel = playerCharacterStore.get('classLevel');
    const inventoryConfig = playerCharacterStore.get('inventoryConfig');

    this.playerCharacter = this.characterService.generate(
      creatureId,
      classId,
      classLevel,
      [{ itemType: 'clothing', itemId: 'sandals' }],
      this
    );

    level.attachPlayerCharacter(this.playerCharacter);

    // Attach player sprite input listeners...

    // Required so player sprite remains interactive when attached to a level.
    this.scene.bringToTop('Main');

    const sandals = level.add.image(48 * 3 + 24, 48 * 3 + 24, 'sandals');
    sandals.setOrigin(0.5, 1);
  }
}
