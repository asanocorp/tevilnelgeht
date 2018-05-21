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

  private pendingCharacterAttachments: CharacterAttachment[] = [];

  private pendingCharacterDetachments: CharacterAttachment[] = [];

  private nonPlayerCharacterAttachments: CharacterAttachment[] = [];

  private playerCharacterAttachment: CharacterAttachment;

  private isPlayerTurn = false;

  private playerPathCache = {};

  private endPlayerTurn: (actionCost?: number) => void;

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

  private playerCharacterTurnListener(player: Character, cost: (c?: number) => void, endTurn: () => void): void {
    console.log('player turn');
    this.isPlayerTurn = true;
    this.endPlayerTurn = (actionCost?: number) => {
      cost(actionCost);
      endTurn();
      this.isPlayerTurn = false;
      this.playerPathCache = {};
    };
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

    this.terrainAwareMovementGrid = new Grid(width, height);

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

    Object.keys(this.datamap).forEach(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      this.terrainAwareMovementGrid.setWalkableAt(x, y, !this.datamap[index].terrainRules.blockMove);
    });

    this.tilemap = this.make.tilemap({
      tileWidth: this.terrainService.tileWidth,
      tileHeight: this.terrainService.tileHeight,
      width,
      height
    });

    const layer = this.tilemap.createBlankDynamicLayer(
      'Terrain',
      this.tilemap.addTilesetImage(this.terrainService.tilesetImageKey),
      undefined,
      undefined,
      undefined,
      undefined
    );

    layer.setInteractive();
    layer.on('pointermove', pointer => {
      if (!this.isPlayerTurn) {
        return;
      }

      const tile = this.getPointerTile(pointer);

      if (this.currentPointerTile !== tile) {
        const index = tile.x + ',' + tile.y;

        if (!this.playerPathCache[index]) {
          this.playerPathCache[index] = this.pathfinder.findPath(
            this.playerCharacterAttachment.position.x,
            this.playerCharacterAttachment.position.y,
            tile.x,
            tile.y,
            this.terrainAwareMovementGrid.clone()
          );
        }

        const path = this.playerPathCache[index];

        if (path.length > 1) {

        } else {

        }

        this.currentPointerTile = tile;
      }
    });
    layer.on('pointerdown', pointer => {
      if (!this.isPlayerTurn) {
        return;
      }

      const tile = this.getPointerTile(pointer);
      const index = tile.x + ',' + tile.y;

      if (!this.playerPathCache[index]) {
        this.playerPathCache[index] = this.pathfinder.findPath(
          this.playerCharacterAttachment.position.x,
          this.playerCharacterAttachment.position.y,
          tile.x,
          tile.y,
          this.terrainAwareMovementGrid.clone()
        );
      }

      const path = this.playerPathCache[index];

      if (path.length > 1) {

      } else {

      }

      this.endPlayerTurn();
    });

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
