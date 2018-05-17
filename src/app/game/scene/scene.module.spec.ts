import { SceneModule } from './scene.module';

describe('SceneModule', () => {
  let sceneModule: SceneModule;

  beforeEach(() => {
    sceneModule = new SceneModule();
  });

  it('should create an instance', () => {
    expect(sceneModule).toBeTruthy();
  });
});
