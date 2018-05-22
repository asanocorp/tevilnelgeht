import { Character } from '../character/character';
import { CharacterActionAnimationManager } from '../character/character-action-animation-manager';
import { CharacterActionManager, CharacterActionType } from '../character/character-action-manager';
import { CharacterManager } from '../character/character-manager';
import { CharacterMoveActionManager } from '../character/character-move-action-manager';
import { TerrainService } from '../terrain/terrain.service';
import { PathfinderManager } from './pathfinder-manager';
import { PathGraphics } from './path-graphics';
import { Scheduler } from './scheduler';

export class Level extends Phaser.Scene {
  private datamap = {};

  private tilemap: Phaser.Tilemaps.Tilemap;

  private currentPointerTile: Phaser.Tilemaps.Tile;

  private scheduler = new Scheduler();

  private pathfinderManager = new PathfinderManager();

  private characterManager = new CharacterManager();

  private characterActionManager: CharacterActionManager;

  private characterActionAnimationManager: CharacterActionAnimationManager;

  private playerCharacterMoveActionManager: CharacterMoveActionManager;

  private isPlayerTurn = false;

  private playerCharacterPathCache: { [key: string]: Phaser.Math.Vector2[] } = {};

  private playerCharacterPathGraphics: PathGraphics;

  private endPlayerTurn: (actionCost?: number) => void;

  private startScheduler = true;

  public constructor(key: string, private terrainService: TerrainService) {
    super({ key });
  }

  public create(): void {
    this.generate();

    this.characterActionAnimationManager = new CharacterActionAnimationManager(this.tilemap);
    this.characterActionManager = new CharacterActionManager(this.characterActionAnimationManager);
    this.playerCharacterMoveActionManager = new CharacterMoveActionManager(this.characterActionManager);

    this.playerCharacterPathGraphics = new PathGraphics(this);
  }

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

  public attachPlayerCharacter(player: Character): void {
    this.characterManager.attachPlayerCharacter(player);
  }

  public detachPlayerCharacter(): Character {
    return this.characterManager.detachPlayerCharacter();
  }

  public getPlacementXY(tileX: number, tileY: number, offsetX = 0.5, offsetY = 0.5): Phaser.Math.Vector2 {
    const position = this.tilemap.tileToWorldXY(tileX, tileY);
    const tile = this.tilemap.getTileAt(tileX, tileY);
    position.add(new Phaser.Math.Vector2(offsetX * tile.width, offsetY * tile.height));
    return position;
  }

  private onCharacterAttachment(attachment): void {
    const sprite = attachment.sprite;

    if (attachment.isPlayer) {
      sprite.on('turn', this.playerCharacterTurnListener, this);
    } else {
      // sprite.on('turn', (character, cost, endTurn) => { cost(); endTurn(); }, this);
      // sprite.on('pointerover', () => attachment.character.setTint(0xff0000));
      // sprite.on('pointerout', () => attachment.character.clearTint());
      // sprite.on('pointermove', () => attachment.character.setAlpha(0.5, 1, 1, 0.5));
    }

    const position = this.getPlacementXY(attachment.position.x, attachment.position.y);

    sprite.setPosition(position.x, position.y);
    sprite.play('idle');

    this.add.existing(sprite).setInteractive();
    this.scheduler.add(sprite);
  }

  private onCharacterDetachment(attachment): void {
    const sprite = attachment.sprite;

    if (attachment.isPlayer) {
      sprite.off('turn', this.playerCharacterTurnListener, this, false);
    } else {
      // sprite.off('turn', () => console.log('derp'), this, false);
    }

    this.scheduler.remove(sprite);
    this.sys.displayList.remove(sprite);
    this.sys.updateList.remove(sprite);
  }

  private playerCharacterTurnListener(player: Character, cost: (c?: number) => void, endTurn: () => void): void {
    this.endPlayerTurn = (actionCost?: number) => {
      cost(actionCost);
      endTurn();
      this.isPlayerTurn = false;
      this.playerCharacterPathCache = {};
    };

    this.characterActionAnimationManager.run(() => this.startPlayerTurn());
  }

  private startPlayerTurn(): void {
    this.pathfinderManager.buildTerrainAndCharacterGrid(this.characterManager.getNonPlayerCharacterPositions());

    this.playerCharacterPathGraphics.clear();

    if (this.playerCharacterMoveActionManager.hasPending()) {
      const actions = this.playerCharacterMoveActionManager.getPending();

      const path = actions.map(action => action.payload.from);
      path.push(actions[actions.length - 1].payload.to);

      this.playerCharacterPathGraphics.drawPath(path);

      if (this.playerCharacterMoveActionManager.processNext(position => this.pathfinderManager.allowsMove(position))) {
        this.endPlayerTurn();
        return;
      } else {
        this.playerCharacterMoveActionManager.clear();
      }
    }

    this.isPlayerTurn = true;
  }

  private tilemapPointerDownListener(pointer): void {
    if (!this.isPlayerTurn || this.playerCharacterMoveActionManager.hasPending()) {
      return;
    }

    const tile = this.getPointerTile(pointer);
    const path = this.getPlayerPath(tile);

    if (path.length > 1) {
      this.playerCharacterMoveActionManager.add(this.characterManager.getPlayerCharacterData(), path);

      if (this.playerCharacterMoveActionManager.processNext(position => this.pathfinderManager.allowsMove(position))) {
        this.endPlayerTurn();
      }
    }
  }

  private tilemapPointerMoveListener(pointer): void {
    if (!this.isPlayerTurn || this.playerCharacterMoveActionManager.hasPending()) {
      return;
    }

    const tile = this.getPointerTile(pointer);

    if (tile && this.currentPointerTile !== tile) {
      this.currentPointerTile = tile;

      const path = this.getPlayerPath(tile);

      this.playerCharacterPathGraphics.clear();

      if (path.length > 1) {
        this.playerCharacterPathGraphics.drawPath(path);
      }
    }
  }

  private getPlayerPath(tile: Phaser.Tilemaps.Tile): Phaser.Math.Vector2[] {
    const index = tile.x + ',' + tile.y;

    if (!this.playerCharacterPathCache[index]) {
      const playerPosition = this.characterManager.getPlayerCharacterPosition();
      this.playerCharacterPathCache[index] = this.pathfinderManager.find(playerPosition, new Phaser.Math.Vector2(tile.x, tile.y));
    }

    return this.playerCharacterPathCache[index];
  }

  private getPointerTile(pointer): Phaser.Tilemaps.Tile {
    const position = pointer.position;
    return this.tilemap.getTileAtWorldXY(position.x, position.y);
  }

  private generate(): void {
    const width = 9;
    const height = 9;

    const terrainCategory = this.terrainService.TerrainCategory.Dungeon;
    const terrainSubTypes = this.terrainService.TerrainSubType;

    // const map = {};

    const wallNoFaceRules = this.terrainService.getTerrainRules(terrainCategory, terrainSubTypes.WallNoFace);
    const wallBottomFaceRules = this.terrainService.getTerrainRules(terrainCategory, terrainSubTypes.WallBottomFace);
    const floorRules = this.terrainService.getTerrainRules(terrainCategory, terrainSubTypes.Floor);

    this.datamap[0 + ',' + 0] = { terrainRules: wallNoFaceRules };
    for (let x = 1; x < width - 1; ++x) {
      this.datamap[x + ',' + 0] = { terrainRules: wallBottomFaceRules };
    }
    this.datamap[(width - 1) + ',' + 0] = { terrainRules: wallNoFaceRules };

    for (let y = 1; y < height - 1; ++y) {
      this.datamap[0 + ',' + y] = { terrainRules: wallNoFaceRules };
      for (let x = 1; x < width - 1; ++x) {
        this.datamap[x + ',' + y] = { terrainRules: floorRules };
      }
       this.datamap[(width - 1) + ',' + y] = { terrainRules: wallNoFaceRules };
    }

    this.datamap[0 + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };
    for (let x = 1; x < width - 1; ++x) {
      this.datamap[x + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };
    }
    this.datamap[(width - 1) + ',' + (height - 1)] = { terrainRules: wallNoFaceRules };

    this.tilemap = this.make.tilemap({
      tileWidth: this.terrainService.tileWidth,
      tileHeight: this.terrainService.tileHeight,
      width,
      height
    });

    this.pathfinderManager.buildTerrainGrid(width, height, this.datamap);
    // this.buildTerrainAwareMovementGrid();

    const layer = this.tilemap.createBlankDynamicLayer(
      'Terrain',
      this.tilemap.addTilesetImage(this.terrainService.tilesetImageKey),
      undefined,
      undefined,
      undefined,
      undefined
    );

    layer.setInteractive();
    layer.on('pointermove', pointer => this.tilemapPointerMoveListener(pointer));
    layer.on('pointerdown', pointer => this.tilemapPointerDownListener(pointer));

    const wallNoFaceIndex = this.terrainService.getTileIndex(terrainCategory, this.terrainService.TerrainSubType.WallNoFace);
    const wallBottomFaceIndex = this.terrainService.getTileIndex(terrainCategory, this.terrainService.TerrainSubType.WallBottomFace);
    const floorIndex = this.terrainService.getTileIndex(terrainCategory, this.terrainService.TerrainSubType.Floor);

    Object.keys(this.datamap).map(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      switch (this.datamap[index].terrainRules.terrainSubType) {
        case this.terrainService.TerrainSubType.WallNoFace:
          this.tilemap.putTileAt(wallNoFaceIndex, x, y);
          break;
        case this.terrainService.TerrainSubType.WallBottomFace:
          this.tilemap.putTileAt(wallBottomFaceIndex, x, y);
          break;
        case this.terrainService.TerrainSubType.Floor:
        this.tilemap.putTileAt(floorIndex, x, y);
          break;
      }
    });
  }
}
