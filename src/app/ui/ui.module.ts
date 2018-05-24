import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MenuComponent } from './menu/menu.component';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';

const uiComponents = [MenuComponent, ModalComponent];
const uiServices = [ModalService];

@NgModule({
  declarations: [uiComponents],
  imports: [SharedModule],
  exports: [uiComponents],
  providers: uiServices
})
export class UiModule { }
