import { NgModule } from '@angular/core';
import { MatCardModule, MatDialogModule, MatIconModule, MatListModule, MatRadioModule } from '@angular/material';

const materialModules = [MatCardModule, MatDialogModule, MatIconModule, MatListModule, MatRadioModule];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule { }
