import { AStarFinder, DiagonalMovement, Grid } from 'pathfinding';

export enum PathfinderGridType {
  Terrain,
  TerrainAndCharacter
}

export class PathfinderManager {
  private aStarDiagFinder = new AStarFinder({ diagonalMovement: DiagonalMovement.Always });

  private aStarOrthoFinder = new AStarFinder();

  private terrainGrid: Grid;

  private terrainAndCharacterGrid: Grid;

  public find(
    start: Phaser.Math.Vector2,
    end: Phaser.Math.Vector2,
    ortho = false,
    gridType = PathfinderGridType.TerrainAndCharacter
  ): Phaser.Math.Vector2[] {
    const pathfinder = ortho ? this.aStarOrthoFinder : this.aStarDiagFinder;
    const grid = this.getGrid(gridType).clone();
    return pathfinder.findPath(start.x, start.y, end.x, end.y, grid).map(p => new Phaser.Math.Vector2(p[0], p[1]));
  }

  public allowsMove(position: Phaser.Math.Vector2, gridType = PathfinderGridType.TerrainAndCharacter): boolean {
    return this.getGrid(gridType).isWalkableAt(position.x, position.y);
  }

  public buildTerrainGrid(width: number, height: number, data: any): void {
    this.terrainGrid = new Grid(width, height);

    Object.keys(data).forEach(index => {
      const [x, y] = index.split(',').map(c => Number.parseInt(c));
      this.terrainGrid.setWalkableAt(x, y, !data[index].terrainRules.blockMove);
    });
  }

  public buildTerrainAndCharacterGrid(characterPositions: Phaser.Math.Vector2[]): void {
    this.terrainAndCharacterGrid = this.terrainGrid.clone();
    characterPositions.forEach(position => this.terrainAndCharacterGrid.setWalkableAt(position.x, position.y, false));
  }

  private getGrid(gridType: PathfinderGridType): Grid {
    switch (gridType) {
      case PathfinderGridType.Terrain:
        return this.terrainGrid;
      case PathfinderGridType.TerrainAndCharacter:
      default:
        return this.terrainAndCharacterGrid;
    }
  }
}
