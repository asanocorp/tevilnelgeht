import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';

import { UiTransition } from '../ui-transition';

/**
 * Modal state.
 */
interface ModalState {
  /**
   * Current.
   */
  current: ModalTransitionTarget;

  /**
   * Transitions.
   */
  transitions: ModalTransitions;
}

/**
 * Modal transition target.
 */
interface ModalTransitionTarget {
  /**
   * Transition label.
   */
  label: string;

  /**
   * Transition component type.
   */
  componentType: Type<any>;
}

/**
 * Modal transitions.
 */
interface ModalTransitions {
  /**
   * Transitions, to => from.
   */
  [to: string]: ModalTransitionTarget;
}

/**
 * Modal service.
 */
@Injectable()
export class ModalService implements UiTransition {
  /**
   * Current modal transition.
   */
  private current: ModalTransitionTarget = { label: undefined, componentType: undefined };

  /**
   * Current modal component type subject.
   */
  private componentTypeSubject = new Subject<Type<any>>();

  /**
   * Modal transitions.
   */
  private transitions: ModalTransitions = {};

  public game: Phaser.Game;

  /**
   * Deactivate current UI component host and clear its internal state.
   */
  public deactivate(): void {
    this.current = { label: undefined, componentType: undefined };
    this.transitions = {};
    this.componentTypeSubject.next(undefined);
  }

  /**
   * Get component type subject.
   */
  public getComponentTypeSubject(): Subject<Type<any>> {
    return this.componentTypeSubject;
  }

  /**
   * Reverse current UI component transition.
   */
  public reverseUiTransition(): void {
    const label = this.current.label;
    this.current = this.transitions[label];
    this.transitions[label] = undefined;

    if (this.current) {
      this.componentTypeSubject.next(this.current.componentType);
    }
  }

  /**
   * Transition with specified label to UI component of specified type.
   *
   * @param label Transition label.
   * @param componentType Component type.
   */
  public transitionUi(label: string, componentType: Type<any>): void {
    this.transitions[label] = this.current;
    this.current = { label, componentType };
    this.componentTypeSubject.next(componentType);
  }
}
