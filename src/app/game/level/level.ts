import { StoreService } from '../../core/store.service';

import { Character } from '../character/character';
import { CharacterData, CharacterManager } from '../character/character-manager';
import { CharacterService } from '../character/character.service';
import { CreatureService } from '../creature/creature.service';
import { StoreNamespace } from '../store-namespace.enum';
import { TerrainService } from '../terrain/terrain.service';

import { LevelTemplate } from './level-template';
import { PathGraphics } from './path-graphics';
import { PathfinderManager } from './pathfinder-manager';
import { Scheduler } from './scheduler';


/**
 * Game level - display & data container for current game play.
 */
export class Level extends Phaser.Scene {
  /**
   * Level tilemap.
   */
  private tilemap: Phaser.Tilemaps.Tilemap;

  /**
   * Tile that is currently under the pointer.
   */
  private currentPointerTile: Phaser.Tilemaps.Tile;

  /**
   * Turn scheduler.
   */
  private scheduler = new Scheduler();

  /**
   * Pathfinder manager.
   */
  private pathfinderManager = new PathfinderManager();

  /**
   * Character manager.
   */
  private characterManager = new CharacterManager();

  /**
   * Player turn flag.
   */
  private isPlayerTurn = false;

  /**
   * Player path cache.
   */
  private playerCharacterPathCache: { [key: string]: Phaser.Math.Vector2[] } = {};

  /**
   * Player path graphics.
   */
  private playerCharacterPathGraphics: PathGraphics;

  /**
   * End current character's turn.
   *
   * @param actionCost Delay until character's next turn.
   */
  private endCharacterTurn: (actionCost?: number) => void;

  /**
   * Start scheduler flag.
   */
  private startScheduler = true;

  /**
   * Instantiate level.
   *
   * @param key Unique level identifier.
   * @param template Data with which this level is built & displayed.
   * @param storeService Store service.
   */
  public constructor(
    key: string,
    private template: LevelTemplate,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private terrainService: TerrainService,
    private storeService: StoreService
  ) {
    super({ key });
  }

  /**
   * Create the level once all systems are running.
   */
  public create(): void {
    this.createTilemap();

    this.pathfinderManager.buildTerrainGrid(this.template.width, this.template.height, this.template.datamap);

    this.characterManager.getCharacterActionAnimationManager().setTileDimensions(this.tilemap.tileWidth, this.tilemap.tileHeight);

    this.playerCharacterPathGraphics = new PathGraphics(this);
  }

  /**
   * Update the level based on any pending changes.
   */
  public update(): void {
    this.characterManager.update(
      attachment => this.onCharacterAttachment(attachment),
      attachment => this.onCharacterDetachment(attachment)
    );

    if (this.startScheduler) {
      this.scheduler.start();
      this.startScheduler = false;
    }
  }

  /**
   * Attach the player character to level.
   *
   * @param player Player character.
   */
  public attachPlayerCharacter(player: Character): void {
    const levelData = this.storeService.namespace(StoreNamespace.Level).namespace('levelData').get(this.sys.settings.key, {});

    let position = new Phaser.Math.Vector2(4, 4);

    if (levelData.pc && levelData.pc.pos) {
      position = new Phaser.Math.Vector2(levelData.pc.pos.x, levelData.pc.pos.y);
    }

    this.characterManager.attachPlayerCharacter(player, position);
  }

  /**
   * Detach player character from level.
   */
  public detachPlayerCharacter(): Character {
    return this.characterManager.detachPlayerCharacter();
  }

  /**
   * Get sprite origin placement position in world coordinates.
   *
   * @param tileX X coordinate of tile.
   * @param tileY Y cooridinate of tile.
   * @param offsetX Value in range [0,1] that interpolate's tile width.
   * @param offsetY Value in range [0,1] that interpolate's tile height.
   */
  public getPlacementXY(tileX: number, tileY: number, offsetX = 0.5, offsetY = 0.5): Phaser.Math.Vector2 {
    const position = this.tilemap.tileToWorldXY(tileX, tileY);
    const tile = this.tilemap.getTileAt(tileX, tileY);
    position.add(new Phaser.Math.Vector2(offsetX * tile.width, offsetY * tile.height));
    return position;
  }

  /**
   * Perform level hooks on character attachment.
   *
   * @param attachment Character attachment to level.
   */
  private onCharacterAttachment(attachment): void {
    const sprite = attachment.sprite;

    sprite.on('turn', this.characterTurnListener, this);

    const position = this.getPlacementXY(attachment.position.x, attachment.position.y);

    sprite.setPosition(position.x, position.y);
    this.anims.play(sprite.defaultAnimation, sprite);

    this.add.existing(sprite).setInteractive();
    this.scheduler.add(sprite);

    if (attachment.isPlayer) {
      this.cameras.main.startFollow(sprite, true);
    }
  }

  /**
   * Perform level hooks on character detachment.
   *
   * @param attachment Character attachment to level.
   */
  private onCharacterDetachment(attachment): void {
    const sprite = attachment.sprite;

    sprite.off('turn', this.characterTurnListener, this, false);

    this.scheduler.remove(sprite);
    this.sys.displayList.remove(sprite);
    this.sys.updateList.remove(sprite);
  }

  /**
   * Listen & setup for character turn.
   *
   * @param character Character (PC or NPC).
   * @param cost Callback that sets this character's delay until next turn.
   * @param endTurn Callback that ends this character's turn.
   */
  private characterTurnListener(character: Character, cost: (c?: number) => void, endTurn: () => void): void {
    const attachment = character.attachment;

    // Set end turn method for current character turn.
    this.endCharacterTurn = (actionCost?: number) => {
      if (attachment.isPlayer) {
        this.isPlayerTurn = false;
        this.playerCharacterPathCache = {};
      }

      cost(actionCost);
      endTurn();
    };

    if (attachment.isPlayer) {
      // Save level state.
      this.storeLevel();
      this.storePlayer();

      // Start PC turn after pending character action animations are complete.
      this.characterManager.getCharacterActionAnimationManager().run(() => this.startCharacterTurn(attachment));
    } else {
      // Start NPC turn.
      this.startCharacterTurn(attachment);
    }
  }

  private storePlayer(): void {
    const pcData = this.characterManager.getPlayerCharacterData();

    /*const inventoryConfig = Object.keys(pcData.sprite.equipmentSlots)
      .filter(slot => pcData.sprite.equipmentSlots[slot] !== undefined)
      .map(slot => ({ equipped: slot, key: pcData.sprite.equipmentSlots[slot].key}))
      .concat(pcData.sprite.inventory);*/

    const playerCharacterStore = this.storeService.namespace(StoreNamespace.PlayerCharacter);
    playerCharacterStore.set('creatureId', pcData.sprite.creatureConfig.creatureId);
    playerCharacterStore.set('classId', pcData.sprite.classConfig.classId);
    playerCharacterStore.set('classLevel', pcData.sprite.classConfig.level);
    // playerCharacterStore.set('inventoryConfig', inventoryConfig);
  }

  /**
   * Store the level data.
   */
  private storeLevel(): void {
    const key = this.sys.settings.key;
    const pcData = this.characterManager.getPlayerCharacterData();

    const levelData = {
      pc: {
        pos: { x: pcData.position.x, y: pcData.position.y }
      },
      npc: this.characterManager.getNonPlayerCharacterData().map(characterData => {
        const creatureId = characterData.sprite.creatureConfig.creatureId;
        const classConfig = {
          classId: characterData.sprite.classConfig.classId,
          level: characterData.sprite.classConfig.level
        };

        /*const inventoryConfig = Object.keys(characterData.sprite.equipmentSlots)
          .filter(slot => characterData.sprite.equipmentSlots[slot] !== undefined)
          .map(slot => ({ equipped: slot, key: characterData.sprite.equipmentSlots[slot].key}))
          .concat(characterData.sprite.inventory);*/

        return { creatureId, classConfig, /*inventoryConfig*/ };
      })
    };

    const levelStore = this.storeService.namespace(StoreNamespace.Level);
    levelStore.set('currentLevel', key);

    const levelDataStore = levelStore.namespace('levelData');
    levelDataStore.set(key, levelData);
  }

  /**
   * Start character turn.
   *
   * @param attachment Character's level attachment.
   */
  private startCharacterTurn(attachment: CharacterData): void {
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(attachment);

    // Build character specific pathfinder grid.
    if (attachment.isPlayer) {
      this.pathfinderManager.buildTerrainAndCharacterGrid(this.characterManager.getNonPlayerCharacterPositions());

      if (this.currentPointerTile && !moveActionManager.hasPending()) {
        // Render updated path to from player to current pointer tile.
        this.clearPlayerPath();
        this.renderPlayerPath(this.getPlayerPath(this.currentPointerTile));
      }
    } else {
      this.pathfinderManager.buildTerrainAndCharacterGrid(this.characterManager.getCharacterPositions([attachment]));
    }

    // Resolve any pending move actions for character.
    if (moveActionManager.hasPending()) {
      if (attachment.isPlayer) {
        // Render updated pending player path.
        this.clearPlayerPath();
        this.renderPlayerPath(moveActionManager.getPendingPath());
      }

      if (moveActionManager.processNext(position => this.pathfinderManager.allowsMove(position))) {
        // Good move, end turn.
        this.endCharacterTurn();
        return;
      } else {
        // Path is blocked, clear path & await new character action.
        moveActionManager.clear();
      }
    }

    // No pending move actions or path is blocked, perform character specific action.
    if (attachment.isPlayer) {
      this.isPlayerTurn = true;
      console.log(attachment);
    } else {
      // Execute npc action...
    }
  }

  /**
   * Get player path to tile.
   *
   * @param tile Destination tile.
   */
  private getPlayerPath(tile: Phaser.Tilemaps.Tile): Phaser.Math.Vector2[] {
    const index = tile.x + ',' + tile.y;

    if (!this.playerCharacterPathCache[index]) {
      const playerPosition = this.characterManager.getPlayerCharacterPosition();
      this.playerCharacterPathCache[index] = this.pathfinderManager.find(playerPosition, new Phaser.Math.Vector2(tile.x, tile.y));
    }

    return this.playerCharacterPathCache[index];
  }

  /**
   * Render the given player path.
   *
   * @param path Player path.
   */
  private renderPlayerPath(path: Phaser.Math.Vector2[]): void {
    if (path.length > 1) {
      this.playerCharacterPathGraphics.drawPath(path);
    }
  }

  /**
   * Clear the player path graphic.
   */
  private clearPlayerPath(): void {
    this.playerCharacterPathGraphics.clear();
  }

  /**
   * Get tile under pointer.
   *
   * @param pointer Input pointer.
   */
  private getPointerTile(pointer): Phaser.Tilemaps.Tile {
    const position = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    return this.tilemap.getTileAtWorldXY(position.x, position.y);
  }

  /**
   * Create the level's tilemap from the level's template.
   */
  private createTilemap(): void {
    const { tileset, tilesetIndex, tileWidth, tileHeight, width, height, datamap } = this.template;

    // Make tilemap & main layer.

    this.tilemap = this.make.tilemap({ tileWidth, tileHeight, width, height });

    const layer = this.tilemap.createBlankDynamicLayer(
      'Terrain',
      this.tilemap.addTilesetImage(tileset),
      undefined,
      undefined,
      undefined,
      undefined
    );

    // Setup main layer's input listeners.
    layer.setInteractive();
    layer.on('pointermove', pointer => this.tilemapPointerMoveListener(pointer));
    layer.on('pointerdown', pointer => this.tilemapPointerDownListener(pointer));

    // Draw tiles.
    Object.keys(datamap).map(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      this.tilemap.putTileAt(tilesetIndex[datamap[index].terrainRules.terrainTextureType], x, y);
    });
  }

  /**
   * Tilemap pointer move listener.
   *
   * @param pointer Input pointer.
   */
  private tilemapPointerMoveListener(pointer): void {
    const playerAttachment = this.characterManager.getPlayerCharacterData();
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(playerAttachment);

    const tile = this.getPointerTile(pointer);

    if (tile && this.currentPointerTile !== tile) {
      this.currentPointerTile = tile;

      if (!this.isPlayerTurn || moveActionManager.hasPending()) {
        return;
      }

      // Player turn & no pending move actions.

      this.clearPlayerPath();
      this.renderPlayerPath(this.getPlayerPath(tile));
    }
  }

  /**
   * Tilemap pointer down listener.
   *
   * @param pointer Input pointer.
   */
  private tilemapPointerDownListener(pointer): void {
    const playerAttachment = this.characterManager.getPlayerCharacterData();
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(playerAttachment);

    if (!this.isPlayerTurn || moveActionManager.hasPending()) {
      return;
    }

    const path = this.getPlayerPath(this.getPointerTile(pointer));

    if (path.length > 1) {
      moveActionManager.add(playerAttachment, path);

      if (moveActionManager.processNext(position => this.pathfinderManager.allowsMove(position))) {
        this.endCharacterTurn();
      }
    }
  }
}
