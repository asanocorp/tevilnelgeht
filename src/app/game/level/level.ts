import { AStarFinder, Grid } from 'pathfinding';

import { Character } from '../character/character';
import { TerrainService } from '../terrain/terrain.service';
import { Scheduler } from './scheduler';

interface CharacterAttachment {
  character: Character;
  position: Phaser.Math.Vector2;
  isPlayer?: boolean;
}

export class Level extends Phaser.Scene {
  private datamap = {};

  private tilemap: Phaser.Tilemaps.Tilemap;

  private currentPointerTile: Phaser.Tilemaps.Tile;

  private scheduler = new Scheduler();

  private pathfinder = new AStarFinder();

  private terrainAwareMovementGrid: Grid;

  private terrainAndCharacterAwareMovementGrid: Grid;

  private pendingCharacterAttachments: CharacterAttachment[] = [];

  private pendingCharacterDetachments: CharacterAttachment[] = [];

  private nonPlayerCharacterAttachments: CharacterAttachment[] = [];

  private characterTurnAnimationQueue = [];

  private playerCharacterAttachment: CharacterAttachment;

  private isPlayerTurn = false;

  private playerPathCache: { [key: string]: number[][] } = {};

  private endPlayerTurn: (actionCost?: number) => void;

  private playerCharacterMoveActionQueue = [];

  private startScheduler = true;

  public constructor(key: string, private terrainService: TerrainService) {
    super({ key });
  }

  public create(): void {
    this.generate();
  }

  public update(): void {
    this.processPendingCharacterDetachments();
    this.processPendingCharacterAttachments();
    this.playerCharacterAttachment.character.update();

    if (this.startScheduler) {
      this.scheduler.start();
      this.startScheduler = false;
    }
  }

  public attachPlayerCharacter(player: Character): void {
    this.pendingCharacterAttachments.push({ character: player, position: new Phaser.Math.Vector2(4, 4), isPlayer: true });
  }

  public detachPlayerCharacter(): Character {
    this.pendingCharacterDetachments.push(this.playerCharacterAttachment);
    return this.playerCharacterAttachment.character;
  }

  private attachNonPlayerCharacter(character: Character, position: Phaser.Math.Vector2): void {
    this.pendingCharacterAttachments.push({ character, position });
  }

  private detachNonPlayerCharacter(character: Character): void {
    const characterAttachment = this.nonPlayerCharacterAttachments.find(attachment => character === attachment.character);
    this.pendingCharacterDetachments.push(characterAttachment);
  }

  private processPendingCharacterAttachments(): void {
    this.pendingCharacterAttachments.forEach(attachment => {
      if (attachment.isPlayer) {
        this.playerCharacterAttachment = attachment;
        attachment.character.on('turn', this.playerCharacterTurnListener, this);
      } else {
        this.nonPlayerCharacterAttachments.push(attachment);
        // attachment.character.on('pointerover', () => attachment.character.setTint(0xff0000));
        // attachment.character.on('pointerout', () => attachment.character.clearTint());
        // attachment.character.on('pointermove', () => attachment.character.setAlpha(0.5, 1, 1, 0.5));
      }

      const position = this.getPlacementXY(attachment.position.x, attachment.position.y);

      attachment.character.setPosition(position.x, position.y);
      attachment.character.play('idle');

      this.add.existing(attachment.character).setInteractive();
      this.scheduler.add(attachment.character);
    });

    this.pendingCharacterAttachments.length = 0;
  }

  private processPendingCharacterDetachments(): void {
    this.pendingCharacterDetachments.forEach(attachment => {
      if (attachment.isPlayer) {
        this.playerCharacterAttachment = undefined;
        attachment.character.off('turn', this.playerCharacterTurnListener, this, false);
      } else {
        const index = this.nonPlayerCharacterAttachments.indexOf(attachment);
        this.nonPlayerCharacterAttachments.splice(index, 1);
      }

      this.scheduler.remove(attachment.character);
      this.sys.displayList.remove(attachment.character);
      this.sys.updateList.remove(attachment.character);
    });

    this.pendingCharacterDetachments.length = 0;
  }

  private buildTerrainAwareMovementGrid(): void {
    this.terrainAwareMovementGrid = new Grid(this.tilemap.width, this.tilemap.height);

    Object.keys(this.datamap).forEach(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      this.terrainAwareMovementGrid.setWalkableAt(x, y, !this.datamap[index].terrainRules.blockMove);
    });
  }

  private buildTerrainAndCharacterAwareMovementGrid(): void {
    this.terrainAndCharacterAwareMovementGrid = this.terrainAwareMovementGrid.clone();
    this.nonPlayerCharacterAttachments.forEach(attachment => {
      const position = attachment.position;
      this.terrainAndCharacterAwareMovementGrid.setWalkableAt(position.x, position.y, false);
    });
  }

  private dispatchAction(action): void {
    switch (action.type) {
      case 'move':
        const payload = action.payload;
        const attachment = payload.active;
        const character = attachment.character;
        const from = payload.from;
        const to = payload.to;

        attachment.position.copy(to);

        const magnitude = to.subtract(from);

        const duration = 1000;

        const tweenStart = () => {
          character.play(magnitude.x >= 0 ? 'walkRight' : 'walkLeft');
        };

        const tweenEnd = () => {
          character.play('idle');
        };

        this.characterTurnAnimationQueue.push({ type: 'move', magnitude, character, tweenStart, tweenEnd, duration });
        break;
      default:
        break;
    }
  }

  private playerCharacterTurnListener(player: Character, cost: (c?: number) => void, endTurn: () => void): void {
    this.endPlayerTurn = (actionCost?: number) => {
      cost(actionCost);
      endTurn();
      this.isPlayerTurn = false;
      this.playerPathCache = {};
    };

    // Update display of level state based on display update queue items, then start player turn...

    if (this.characterTurnAnimationQueue.length) {
      // Process queue & do some async shit...

      const totalAnimations = this.characterTurnAnimationQueue.length;
      let completedAnimations = 0;
      const batches = [];

      let move = [];
      this.characterTurnAnimationQueue.forEach(animation => {
        if (animation.type === 'move') {
          move.push(animation);
        } else {
          batches.push(move);
          batches.push([animation]);
          move = [];
        }
      });

      if (move.length) {
        batches.push(move);
      }

      const onAnimationsBatchComplete = () => {
        if (completedAnimations >= totalAnimations) {
          this.characterTurnAnimationQueue.length = 0;
          this.startPlayerTurn();
        } else {
          console.log(batches);
          const batch = batches.shift();
          const totalBatchAnimations = batch.length;
          let completedBatchAnimations = 0;

          batch.forEach(animation => {
            switch (animation.type) {
              case 'move':
                console.log(animation);
                const character = animation.character;
                const magnitude = animation.magnitude;
                const path = new Phaser.Curves.Path();
                const dst = new Phaser.Math.Vector2(magnitude.x, magnitude.y);

                dst.multiply(new Phaser.Math.Vector2(this.tilemap.tileWidth, this.tilemap.tileHeight));
                path.add(new (Phaser.Curves as any).Line([0, 0, dst.x, dst.y]));

                character.setPath(path);
                character.startFollow(animation.duration);
                character.pathTween.setCallback('onStart', () => animation.tweenStart(), []);
                character.pathTween.setCallback('onComplete', () => {
                  animation.tweenEnd();

                  if (++completedBatchAnimations >= totalBatchAnimations) {
                    completedAnimations += completedBatchAnimations;
                    onAnimationsBatchComplete();
                  }
                }, []);

                break;
              default:
                break;
            }
          });
        }
      };

      onAnimationsBatchComplete();
    } else {
      this.startPlayerTurn();
    }
  }

  private startPlayerTurn(): void {
    this.buildTerrainAndCharacterAwareMovementGrid();

    if (this.playerCharacterMoveActionQueue.length) {
      const action = this.playerCharacterMoveActionQueue.shift();

      if (this.terrainAndCharacterAwareMovementGrid.isWalkableAt(action.payload.to.x, action.payload.to.y)) {
        this.dispatchAction(action);
        this.endPlayerTurn();
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

      if (this.terrainAndCharacterAwareMovementGrid.isWalkableAt(firstMove[0], firstMove[1])) {
        // Dispatch move action...
        const action = {
          type: 'move',
          payload: {
            active: this.playerCharacterAttachment,
            from: new Phaser.Math.Vector2(start[0], start[1]),
            to: new Phaser.Math.Vector2(firstMove[0], firstMove[1])
          }
        };

        this.dispatchAction(action);

        if (path.length) {
          // Queue additional player move actions...
          let from = new Phaser.Math.Vector2(firstMove[0], firstMove[1]);
          for (let i = 0, len = path.length; i < len; ++i) {
            const to = new Phaser.Math.Vector2(path[i][0], path[i][1]);
            this.playerCharacterMoveActionQueue.push({ type: 'move', payload: { active: this.playerCharacterAttachment, from, to } });
            from = new Phaser.Math.Vector2(to.x, to.y);
          }
        }

        this.endPlayerTurn();
      }
    }
  }

  private tilemapPointerMoveListener(pointer): void {
    if (!this.isPlayerTurn) {
      return;
    }

    const tile = this.getPointerTile(pointer);

    if (this.currentPointerTile !== tile) {
      this.currentPointerTile = tile;

      const path = this.getPlayerPath(tile);

      if (path.length > 1) {
        // Update player path graphics...
      } else {
        // Hide player path graphics...
      }
    }
  }

  private getPlayerPath(tile: Phaser.Tilemaps.Tile): number[][] {
    const index = tile.x + ',' + tile.y;

    if (!this.playerPathCache[index]) {
      const playerPosition = this.playerCharacterAttachment.position;

      this.playerPathCache[index] = this.pathfinder.findPath(
        playerPosition.x,
        playerPosition.y,
        tile.x,
        tile.y,
        this.terrainAndCharacterAwareMovementGrid.clone()
      );
    }

    return this.playerPathCache[index];
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

    this.buildTerrainAwareMovementGrid();

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
