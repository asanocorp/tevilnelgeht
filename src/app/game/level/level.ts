import { Character } from '../character/character';
import { CharacterActionAnimationManager } from '../character/character-action-animation-manager';
import { CharacterActionManager, CharacterActionType } from '../character/character-action-manager';
import { CharacterManager } from '../character/character-manager';
import { TerrainService } from '../terrain/terrain.service';
import { PathfinderManager } from './pathfinder-manager';
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

  private isPlayerTurn = false;

  private playerCharacterPathCache: { [key: string]: Phaser.Math.Vector2[] } = {};

  private playerCharacterPathGraphic: Phaser.GameObjects.Graphics;

  private endPlayerTurn: (actionCost?: number) => void;

  private playerCharacterMoveActionQueue = [];

  private startScheduler = true;

  public constructor(key: string, private terrainService: TerrainService) {
    super({ key });
  }

  public create(): void {
    this.generate();

    this.characterActionAnimationManager = new CharacterActionAnimationManager(this.tilemap);
    this.characterActionManager = new CharacterActionManager(this.characterActionAnimationManager);

    this.playerCharacterPathGraphic = this.add.graphics();
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

    this.playerCharacterPathGraphic.clear();

    if (this.playerCharacterMoveActionQueue.length) {
      const action = this.playerCharacterMoveActionQueue.shift();

      const startFromPosition = this.getPlacementXY(action.payload.from.x, action.payload.from.y);
      const startToPosition = this.getPlacementXY(action.payload.to.x, action.payload.to.y);
      const pathForGraphic = new (Phaser.Curves as any).Path(startFromPosition.x, startFromPosition.y);

      pathForGraphic.lineTo(startToPosition.x, startToPosition.y);

      this.playerCharacterMoveActionQueue.forEach(queuedAction => {
        const worldPosition = this.getPlacementXY(queuedAction.payload.to.x, queuedAction.payload.to.y);
        pathForGraphic.lineTo(worldPosition.x, worldPosition.y);
      });

      this.playerCharacterPathGraphic.lineStyle(2, 0xff0000, 1);

      pathForGraphic.draw(this.playerCharacterPathGraphic);

      if (this.pathfinderManager.allowsMove(action.payload.to)) {
        this.characterActionManager.dispatch(action);
        this.endPlayerTurn();
        return;
      } else {
        this.playerCharacterMoveActionQueue.length = 0;
      }
    }

    this.isPlayerTurn = true;
  }

  private tilemapPointerDownListener(pointer): void {
    if (!this.isPlayerTurn || this.playerCharacterMoveActionQueue.length) {
      return;
    }

    const tile = this.getPointerTile(pointer);
    const index = tile.x + ',' + tile.y;
    const path = this.getPlayerPath(tile);

    if (path.length > 1) {
      // Queue multiple actions if required, dispatch first action...
      const start = path.shift();
      const firstMove = path.shift();

      if (this.pathfinderManager.allowsMove(firstMove)) {
        // Dispatch move action...
        const action = {
          type: CharacterActionType.Move,
          payload: {
            active: this.characterManager.getPlayerCharacterData(),
            from: new Phaser.Math.Vector2(start.x, start.y),
            to: new Phaser.Math.Vector2(firstMove.x, firstMove.y)
          }
        };

        this.characterActionManager.dispatch(action);

        if (path.length) {
          // Queue additional player move actions...
          let from = new Phaser.Math.Vector2(firstMove.x, firstMove.y);
          for (let i = 0, len = path.length; i < len; ++i) {
            const to = new Phaser.Math.Vector2(path[i].x, path[i].y);
            this.playerCharacterMoveActionQueue.push({
              type: CharacterActionType.Move,
              payload: { active: this.characterManager.getPlayerCharacterData(), from, to }
            });
            from = new Phaser.Math.Vector2(to.x, to.y);
          }
        }

        this.endPlayerTurn();
      }
    }
  }

  private tilemapPointerMoveListener(pointer): void {
    if (!this.isPlayerTurn || this.playerCharacterMoveActionQueue.length) {
      return;
    }

    const tile = this.getPointerTile(pointer);

    if (tile && this.currentPointerTile !== tile) {
      this.currentPointerTile = tile;

      const path = this.getPlayerPath(tile);

      this.playerCharacterPathGraphic.clear();

      if (path.length > 1) {
        // Update player path graphics...
        const startPosition = this.getPlacementXY(path[0].x, path[0].y);
        const pathForGraphic = new (Phaser.Curves as any).Path(startPosition.x, startPosition.y);

        path.forEach(tilePosition => {
          const worldPosition = this.getPlacementXY(tilePosition.x, tilePosition.y);
          pathForGraphic.lineTo(worldPosition.x, worldPosition.y);
        });

        this.playerCharacterPathGraphic.lineStyle(2, 0xff0000, 1);

        pathForGraphic.draw(this.playerCharacterPathGraphic);
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

  private getPlacementXY(tileX: number, tileY: number, offsetX = 0.5, offsetY = 0.5): Phaser.Math.Vector2 {
    const position = this.tilemap.tileToWorldXY(tileX, tileY);
    const tile = this.tilemap.getTileAt(tileX, tileY);
    position.add(new Phaser.Math.Vector2(offsetX * tile.width, offsetY * tile.height));
    return position;
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
