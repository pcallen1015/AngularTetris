import { Component, OnInit, Input } from '@angular/core';
import { BoardLocation, Tetrimino, TetriminoType, TetriminoMove } from '../../models/tetrimino';

const REFRESH_RATE: number = 100;

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() height: number = 20;
  @Input() width: number = 10;
  public board: boolean[][] = [];
  public tetriminos: Tetrimino[] = [
    new Tetrimino(TetriminoType.I),
    // new Tetrimino(TetriminoType.O)
  ];

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

  private get activeTetrimino(): Tetrimino {
    return this.tetriminos[this.tetriminos.length - 1];
  }

  public ngOnInit(): void {
    this.initBoard();
    this.refresh();

    setInterval(() => {
      // this.activeTetrimino.down();
      this.refresh();
    }, REFRESH_RATE);
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
    return collisions.length === 0;
  }

  public right(): void {
    if (this.willCollide(TetriminoMove.right)) this.activeTetrimino.right();
  }

  public left(): void {
    if (this.willCollide(TetriminoMove.left)) this.activeTetrimino.left();
  }

  public down(): void {
    if (this.willCollide(TetriminoMove.down)) this.activeTetrimino.down();
  }

  public refresh(): void {
    this.initBoard();
    this.tetriminos.forEach(t => this.render(t));
  }

  public render(t: Tetrimino): void {

    t.cells.forEach((loc: BoardLocation) => {
      this.board[loc.row][loc.col] = true;
    });
  }

}
