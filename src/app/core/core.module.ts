import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PhaserModule } from 'phaser-component-library';

import { AppComponent } from '../app.component';
import { GameModule } from '../game/game.module';

/**
 * Core module.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PhaserModule, GameModule],
  exports: [BrowserModule, PhaserModule, GameModule]
})
export class CoreModule { }
