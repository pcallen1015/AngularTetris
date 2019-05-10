import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';

import { TetriminoService } from './services/tetrimino.service';
import { TetriminoGridComponent } from './components/tetrimino-grid/tetrimino-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TetriminoGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    TetriminoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
