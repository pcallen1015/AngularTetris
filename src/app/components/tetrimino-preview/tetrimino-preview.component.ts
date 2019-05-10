import { Component, OnInit, Input } from '@angular/core';
import { Tetrimino } from '../../models/tetrimino';

@Component({
  selector: 'tetrimino-preview',
  templateUrl: './tetrimino-preview.component.html',
  styleUrls: ['./tetrimino-preview.component.scss']
})
export class TetriminoPreviewComponent implements OnInit {
  @Input() t: Tetrimino;
  @Input() w: number;
  @Input() h: number;

  public arr = Array;

  constructor() { }

  ngOnInit() {
  }

}
