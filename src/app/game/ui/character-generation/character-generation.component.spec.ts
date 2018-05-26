import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterGenerationComponent } from './character-generation.component';

describe('CharacterGenerationComponent', () => {
  let component: CharacterGenerationComponent;
  let fixture: ComponentFixture<CharacterGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
