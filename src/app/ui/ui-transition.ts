import { Component, InjectionToken, Type } from '@angular/core';

/**
 * UI transition interface.
 */
export interface UiTransition {
  game: Phaser.Game;

  /**
   * Deactivate current UI component host and clear its internal state.
   */
  deactivate(): void;

  /**
   * Reverse specified UI component transition; if falsey value provided, reverse current UI component transition.
   */
  reverseUiTransition(label?: string): void;

  /**
   * Transition with specified label to UI component of specified type.
   */
  transitionUi(label: string, componentType: Type<any>): void;
}

/**
 * UI transition service injection token.
 */
export const uiTransitionInjectionToken = new InjectionToken<UiTransition>('ui.transition');
