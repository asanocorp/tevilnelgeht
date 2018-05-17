import { TerrainModule } from './terrain.module';

describe('TerrainModule', () => {
  let terrainModule: TerrainModule;

  beforeEach(() => {
    terrainModule = new TerrainModule();
  });

  it('should create an instance', () => {
    expect(terrainModule).toBeTruthy();
  });
});
