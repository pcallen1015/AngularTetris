import { Injectable } from '@angular/core';
import { Tetrimino, TetriminoType, BoardLocation } from '../models/tetrimino';

@Injectable()
export class TetriminoService {

  constructor() { }

  public generateTetrimino(loc: BoardLocation): Tetrimino {
    const keys = Object.keys(TetriminoType);
    let min = 0;
    let max = keys.length;
    let i = Math.floor(Math.random() * (max - min)) + min;
    return new Tetrimino(TetriminoType[keys[i]], loc);
  }

}
