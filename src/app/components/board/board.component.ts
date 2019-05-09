import { Component, OnInit, Input, HostListener } from '@angular/core';
import { BoardLocation, Tetrimino, TetriminoType, TetriminoMove } from '../../models/tetrimino';

enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
}

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() height: number = 20;
  @Input() width: number = 10;
  public board: TetriminoType[][] = [];
  private activeTetrimino: Tetrimino;
  public stageTetrimino: Tetrimino;

  constructor() {
    this.stageTetrimino = this.generateTetrimino();
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.RIGHT_ARROW:
        this.right();
        break;
      case KEY_CODE.LEFT_ARROW:
        this.left();
        break;
      case KEY_CODE.DOWN_ARROW:
        this.down();
        break;
      case KEY_CODE.UP_ARROW:
        this.rotate();
        break;
    }
  }

  private initBoard(): void {
    this.board = [];
    let row: TetriminoType[];
    for (let r = 0; r < this.height; r++) {
      row = [];
      for (let c = 0; c < this.width; c++) {
        row.push(null);
      }
      this.board.push(row);
    }
  }

  public ngOnInit(): void {
    this.initBoard();
    this.nextTetrimino();
  }

  private generateTetrimino(): Tetrimino {
    const keys = Object.keys(TetriminoType);
    let min = 0;
    let max = keys.length;
    let i = Math.floor(Math.random() * (max - min)) + min;
    return new Tetrimino(TetriminoType[keys[i]], new BoardLocation(0, Math.floor(this.width/2)));
  }

  private updateBoardState(): void {
    if (this.activeTetrimino) {
      // Lock in current tetrimino's position before starting the next one
      this.activeTetrimino.cells.forEach((loc: BoardLocation) => {
        this.board[loc.row][loc.col] = this.activeTetrimino.type;
      });
    }
  }

  private nextTetrimino(): void {
    this.updateBoardState();

    // Check for full rows, remove them (TODO: score)
    let fullRows = this.board
      .map((row: TetriminoType[], r: number) => ({ row: r, cells: row }))
      .filter((row: { row: number, cells: TetriminoType[] }) => row.cells.filter(c => c).length === this.width)
      .map((row: { row: number, cells: TetriminoType[] }) => row.row);
    fullRows.sort((a, b) => (b - a)).forEach((r: number) => this.board.splice(r, 1));
    while (this.board.length < this.height) {
      this.board.unshift(new Array(this.width).fill(null));
    }

    // Activate the next Tetrimino
    this.activeTetrimino = this.stageTetrimino;
    this.stageTetrimino = this.generateTetrimino();
  }

  public isCovered(r: number, c: number): boolean {
    return this.activeTetrimino.doesCover(new BoardLocation(r, c));
  }

  public getCellClass(r: number, c: number): string {
    const cell: TetriminoType = this.board[r][c];
    if (cell !== null) return `occupied ${cell}`;
    else if (this.activeTetrimino.doesCover(new BoardLocation(r, c))) return `occupied ${this.activeTetrimino.type}`;
    return 'open';
  }

  // Determine if a given board location is outside the board
  private isOutOfBounds(loc: BoardLocation): boolean {
    return loc.row < 0 || loc.row >= this.height || loc.col < 0 || loc.col >= this.width;
  }

  // Determine if a given board location is already occupied
  private isOccupied(loc: BoardLocation): boolean {
    try {
      return this.board[loc.row][loc.col] !== null;
    } catch (e) {
      return false;
    }
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

  public rotate(): void {
    this.activeTetrimino.rotate();
  }
}
