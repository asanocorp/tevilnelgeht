import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewGameDialogComponent } from './confirm-new-game-dialog.component';

describe('ConfirmNewGameDialogComponent', () => {
  let component: ConfirmNewGameDialogComponent;
  let fixture: ComponentFixture<ConfirmNewGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmNewGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmNewGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
