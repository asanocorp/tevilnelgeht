import { ApplicationRef, NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

/**
 * Application module.
 */
@NgModule({
  imports: [CoreModule],
  bootstrap: [AppComponent]
})
export class AppModule {
  /**
   * Instantiate application module.
   *
   * @param appRef Application reference, needed for [HMR](../hmr.ts).
   */
  public constructor(public appRef: ApplicationRef) { }
}
