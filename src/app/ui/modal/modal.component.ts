import { Compiler, Component, HostBinding, Injector, ReflectiveInjector, Type } from '@angular/core';

import { uiTransitionInjectionToken } from '../ui-transition';

import { ModalService } from './modal.service';

/**
 * Modal component.
 */
@Component({
  selector: 'ui-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  /**
   * Displayed component type.
   *
   * @see {@link https://angular.io/api/common/NgComponentOutlet|NgComponentOutlet}
   */
  public get display(): Type<Component> { return this.displayedComponentType; }

  /**
   * Injector.
   */
  public get injector(): Injector { return this.modalInjector; }

  /**
   * CSS class binding - active state.
   */
  @HostBinding('class.active') public get isActive(): boolean { return this.active; }

  /**
   * Internal active state flag.
   */
  private active: boolean;

  /**
   * Internal displayed component type reference.
   */
  private displayedComponentType: Type<Component>;

  /**
   * Internal modal injector.
   */
  private modalInjector: Injector;

  /**
   * Instantiate modal component.
   *
   * @param modalService Modal service.
   * @param injector Parent injector.
   */
  public constructor(private modalService: ModalService, injector: Injector) {
    this.modalInjector = ReflectiveInjector.resolveAndCreate(
      [{ provide: uiTransitionInjectionToken, useValue: modalService }],
      injector
    );
    modalService.getComponentTypeSubject().subscribe((componentType) => this.setDisplay(componentType));
  }

  /**
   * Set component type to be displayed.
   *
   * @param componentType Component type.
   */
  private setDisplay(componentType: Type<Component>) {
    this.active = !!componentType;
    this.displayedComponentType = componentType;
  }
}
