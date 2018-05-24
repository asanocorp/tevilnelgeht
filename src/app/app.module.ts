import { ApplicationRef, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';



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
