import { TestBed, inject } from '@angular/core/testing';

import { TetriminoService } from './tetrimino.service';

describe('TetriminoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TetriminoService]
    });
  });

  it('should be created', inject([TetriminoService], (service: TetriminoService) => {
    expect(service).toBeTruthy();
  }));
});
