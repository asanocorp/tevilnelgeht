import { NgModule } from '@angular/core';
import { MatCardModule, MatDialogModule, MatIconModule, MatListModule } from '@angular/material';

const materialModules = [MatCardModule, MatDialogModule, MatIconModule, MatListModule];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule { }
