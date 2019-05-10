import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TetriminoPreviewComponent } from './tetrimino-preview.component';

describe('TetriminoPreviewComponent', () => {
  let component: TetriminoPreviewComponent;
  let fixture: ComponentFixture<TetriminoPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TetriminoPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TetriminoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
