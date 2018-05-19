import { TextureModule } from './texture.module';

describe('TextureModule', () => {
  let textureModule: TextureModule;

  beforeEach(() => {
    textureModule = new TextureModule();
  });

  it('should create an instance', () => {
    expect(textureModule).toBeTruthy();
  });
});
