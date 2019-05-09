import { Component, OnInit, Input } from '@angular/core';
import { BoardLocation, Tetrimino, TetriminoType, TetriminoMove } from '../../models/tetrimino';

const REFRESH_RATE: number = 50;

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() height: number = 20;
  @Input() width: number = 10;
  public board: boolean[][] = [];
  private activeTetrimino: Tetrimino;

  constructor() { }

  private initBoard(): void {
    this.board = [];
    let row: boolean[];
    for (let r = 0; r < this.height; r++) {
      row = [];
      for (let c = 0; c < this.width; c++) {
        row.push(false);
      }
      this.board.push(row);
    }
  }

  public ngOnInit(): void {
    this.initBoard();
    this.nextTetrimino();
  }

  private nextTetrimino(): void {
    if (this.activeTetrimino) {
      // Lock in current tetrimino's position before starting the next one
      this.activeTetrimino.cells.forEach((loc: BoardLocation) => {
        this.board[loc.row][loc.col] = true;
      });
    }

    // Check for full rows, remove them (TODO: score)
    let fullRows = this.board
      .map((row: boolean[], r: number) => ({ row: r, cells: row }))
      .filter((row: { row: number, cells: boolean[] }) => row.cells.filter(c => c).length === this.width)
      .map((row: { row: number, cells: boolean[] }) => row.row);
    fullRows.sort((a, b) => (b - a)).forEach((r: number) => this.board.splice(r, 1));
    while (this.board.length < this.height) {
      this.board.unshift(new Array(this.width).fill(false));
    }

    // TODO: randomly generate tetrimino
    this.activeTetrimino = new Tetrimino(TetriminoType.O);
  }

  public isCovered(r: number, c: number): boolean {
    return this.activeTetrimino.doesCover(new BoardLocation(r, c));
  }

  // Determine if a given board location is outside the board
  private isOutOfBounds(loc: BoardLocation): boolean {
    return loc.row < 0 || loc.row >= this.height || loc.col < 0 || loc.col >= this.width;
  }

  // Determine if a given board location is already occupied
  private isOccupied(loc: BoardLocation): boolean {
    return this.board[loc.row][loc.col];
  }

  private willCollide(move: TetriminoMove): boolean {
    let potentialCollisions: BoardLocation[];
    switch (move) {
      case TetriminoMove.right:
        potentialCollisions = this.activeTetrimino.rightAffected;
        break;
      case TetriminoMove.left:
        potentialCollisions = this.activeTetrimino.leftAffected;
        break;
      case TetriminoMove.down:
        potentialCollisions = this.activeTetrimino.downAffected;
        break;
      default:
        console.error('Invalid Move');
        return true;
    }

    let collisions = potentialCollisions.filter(l => this.isOutOfBounds(l) || this.isOccupied(l));
    return collisions.length > 0;
  }

  public right(): void {
    if (!this.willCollide(TetriminoMove.right)) this.activeTetrimino.right();
  }

  public left(): void {
    if (!this.willCollide(TetriminoMove.left)) this.activeTetrimino.left();
  }

  public down(): void {
    if (!this.willCollide(TetriminoMove.down)) this.activeTetrimino.down();
    else {
      // If a tetrimino tries to move down and can't, it's done, new tetrimino
      this.nextTetrimino();
    }
  }
}
