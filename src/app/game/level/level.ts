import { Character } from '../character/character';
import { CharacterData, CharacterManager } from '../character/character-manager';
import { TerrainService } from '../terrain/terrain.service';
import { LevelTemplate } from './level-template';
import { PathfinderManager } from './pathfinder-manager';
import { PathGraphics } from './path-graphics';
import { Scheduler } from './scheduler';

export class Level extends Phaser.Scene {
  private tilemap: Phaser.Tilemaps.Tilemap;

  private currentPointerTile: Phaser.Tilemaps.Tile;

  private scheduler = new Scheduler();

  private pathfinderManager = new PathfinderManager();

  private characterManager = new CharacterManager();

  private isPlayerTurn = false;

  private playerCharacterPathCache: { [key: string]: Phaser.Math.Vector2[] } = {};

  private playerCharacterPathGraphics: PathGraphics;

  private endCharacterTurn: (actionCost?: number) => void;

  private startScheduler = true;

  public constructor(key: string, private template: LevelTemplate) {
    super({ key });
  }

  public create(): void {
    this.createTilemap();

    this.pathfinderManager.buildTerrainGrid(this.template.width, this.template.height, this.template.datamap);

    this.characterManager.getCharacterActionAnimationManager().setTileDimensions(this.tilemap.tileWidth, this.tilemap.tileHeight);

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

    sprite.on('turn', this.characterTurnListener, this);

    const position = this.getPlacementXY(attachment.position.x, attachment.position.y);

    sprite.setPosition(position.x, position.y);
    sprite.play('idle');

    this.add.existing(sprite).setInteractive();
    this.scheduler.add(sprite);
  }

  private onCharacterDetachment(attachment): void {
    const sprite = attachment.sprite;

    sprite.off('turn', this.characterTurnListener, this, false);

    this.scheduler.remove(sprite);
    this.sys.displayList.remove(sprite);
    this.sys.updateList.remove(sprite);
  }

  private characterTurnListener(character: Character, cost: (c?: number) => void, endTurn: () => void): void {
    const attachment = character.attachment;

    this.endCharacterTurn = (actionCost?: number) => {
      if (attachment.isPlayer) {
        this.isPlayerTurn = false;
        this.playerCharacterPathCache = {};
      }

      cost(actionCost);
      endTurn();
    };

    if (attachment.isPlayer) {
      // Start PC turn after pending character action animations are complete.
      this.characterManager.getCharacterActionAnimationManager().run(() => this.startCharacterTurn(attachment));
    } else {
      // Start NPC turn.
      this.startCharacterTurn(attachment);
    }
  }

  private startCharacterTurn(attachment: CharacterData): void {
    // Build character specific pathfinder grid.
    if (attachment.isPlayer) {
      this.pathfinderManager.buildTerrainAndCharacterGrid(this.characterManager.getNonPlayerCharacterPositions());
      this.playerCharacterPathGraphics.clear();
    } else {
      this.pathfinderManager.buildTerrainAndCharacterGrid(this.characterManager.getCharacterPositions([attachment]));
    }

    // Resolve any pending move actions for character.
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(attachment);
    if (moveActionManager.hasPending()) {
      const actions = moveActionManager.getPending();

      if (attachment.isPlayer) {
        const path = actions.map(action => action.payload.from);
        path.push(actions[actions.length - 1].payload.to);

        this.playerCharacterPathGraphics.drawPath(path);
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

  private createTilemap(): void {
    const { tileset, tilesetIndex, tileWidth, tileHeight, width, height, datamap  } = this.template;

    this.tilemap = this.make.tilemap({ tileWidth, tileHeight, width, height });

    const layer = this.tilemap.createBlankDynamicLayer(
      'Terrain',
      this.tilemap.addTilesetImage(tileset),
      undefined,
      undefined,
      undefined,
      undefined
    );

    layer.setInteractive();
    layer.on('pointermove', pointer => this.tilemapPointerMoveListener(pointer));
    layer.on('pointerdown', pointer => this.tilemapPointerDownListener(pointer));

    Object.keys(datamap).map(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      this.tilemap.putTileAt(tilesetIndex[datamap[index].terrainRules.terrainSubType], x, y);
    });
  }

  private tilemapPointerMoveListener(pointer): void {
    const playerAttachment = this.characterManager.getPlayerCharacterData();
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(playerAttachment);

    if (!this.isPlayerTurn || moveActionManager.hasPending()) {
      return;
    }

    const tile = this.getPointerTile(pointer);

    if (tile && this.currentPointerTile !== tile) {
      this.currentPointerTile = tile;

      this.playerCharacterPathGraphics.clear();
      const path = this.getPlayerPath(tile);

      if (path.length > 1) {
        this.playerCharacterPathGraphics.drawPath(path);
      }
    }
  }

  private tilemapPointerDownListener(pointer): void {
    const playerAttachment = this.characterManager.getPlayerCharacterData();
    const moveActionManager = this.characterManager.getCharacterMoveActionManager(playerAttachment);

    if (!this.isPlayerTurn || moveActionManager.hasPending()) {
      return;
    }

    const tile = this.getPointerTile(pointer);
    const path = this.getPlayerPath(tile);

    if (path.length > 1) {
      moveActionManager.add(playerAttachment, path);

      if (moveActionManager.processNext(position => this.pathfinderManager.allowsMove(position))) {
        this.endCharacterTurn();
      }
    }
  }
}
