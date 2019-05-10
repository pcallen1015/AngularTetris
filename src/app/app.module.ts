import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';

import { TetriminoService } from './services/tetrimino.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent
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
