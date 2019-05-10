import { Component, OnInit, Input } from '@angular/core';
import { TetriminoType, Tetrimino, BoardLocation } from '../../models/tetrimino';

@Component({
  selector: 'tetrimino-grid',
  templateUrl: './tetrimino-grid.component.html',
  styleUrls: ['./tetrimino-grid.component.scss']
})
export class TetriminoGridComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;
  @Input() active: Tetrimino;

  public grid: TetriminoType[][];

  constructor() { }

  private initGrid(): void {
    this.grid = new Array(this.height).fill(new Array(this.width).fill(null));
  }

  // Save the position of the active Tetrimino to the grid
  private lockActive(): void {
    if (this.active) {
      // Lock in current tetrimino's position before starting the next one
      this.active.cells.forEach((loc: BoardLocation) => {
        this.grid[loc.row][loc.col] = this.active.type;
      });
    }
  }

  public ngOnInit(): void {
    this.initGrid();
  }

  // Get the class of the cell using the current state of the grid and the active Tetrimino
  public getClass(r: number, c: number): string {
    const cell: TetriminoType = this.grid[r][c];
    if (cell !== null) return `occupied ${cell}`;
    else if (this.active.doesCover(new BoardLocation(r, c))) return `occupied ${this.active.type}`;
    return 'open';
  }

}
