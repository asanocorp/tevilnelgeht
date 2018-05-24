import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material/material.module';

const sharedModules = [CommonModule, MaterialModule];

/**
 * Shared module.
 */
@NgModule({
  imports: sharedModules,
  exports: sharedModules
})
export class SharedModule { }
