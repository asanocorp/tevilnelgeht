import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhaserModule } from 'phaser-component-library';

import { AppComponent } from '../app.component';
import { GameModule } from '../game/game.module';
import { UiModule } from '../ui/ui.module';

const coreModules = [BrowserModule, BrowserAnimationsModule, PhaserModule, GameModule, UiModule];

/**
 * Core module.
 */
@NgModule({
  declarations: [AppComponent],
  imports: coreModules,
  exports: coreModules
})
export class CoreModule { }
