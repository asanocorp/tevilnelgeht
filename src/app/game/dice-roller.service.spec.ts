import { TestBed, inject } from '@angular/core/testing';

import { DiceRollerService } from './dice-roller.service';

describe('DiceRollerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiceRollerService]
    });
  });

  it('should be created', inject([DiceRollerService], (service: DiceRollerService) => {
    expect(service).toBeTruthy();
  }));
});
