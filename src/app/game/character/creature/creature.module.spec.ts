import { CreatureModule } from './creature.module';

describe('CreatureModule', () => {
  let creatureModule: CreatureModule;

  beforeEach(() => {
    creatureModule = new CreatureModule();
  });

  it('should create an instance', () => {
    expect(creatureModule).toBeTruthy();
  });
});
