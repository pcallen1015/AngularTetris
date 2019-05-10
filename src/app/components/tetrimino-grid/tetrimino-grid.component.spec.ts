import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TetriminoGridComponent } from './tetrimino-grid.component';

describe('TetriminoGridComponent', () => {
  let component: TetriminoGridComponent;
  let fixture: ComponentFixture<TetriminoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TetriminoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TetriminoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
