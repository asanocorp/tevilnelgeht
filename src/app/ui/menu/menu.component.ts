import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ui-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnChanges {
  /**
   * Menu title.
   */
  @Input() public title: string;

  /**
   * Menu items.
   */
  @Input() public menuItems: MenuItems;

  /**
   * Current menu item index.
   */
  private currentMenuItemIndex = -1;

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   *
   * @param changes Changed properties.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.menuItems) {
      if (Array.isArray(changes.menuItems.currentValue) && changes.menuItems.currentValue.length) {
        this.currentMenuItemIndex = 0;
        this.traverseToNextMenuItem(0);

        if (this.menuItems[this.currentMenuItemIndex].disabled) {
          this.traverseToNextMenuItem(1);
        }
      } else {
        this.currentMenuItemIndex = -1;
      }
    }
  }

  /**
   * Handle user input.
   *
   * @param $event DOM event object.
   * @param index Optional menu item index.
   */
  @HostListener('mousewheel', ['$event'])     // Chrome
  @HostListener('DOMMouseScroll', ['$event']) // Firefox
  @HostListener('onmousewheel', ['$event'])   // IE
  @HostListener('window:keydown.arrowup', ['$event'])
  @HostListener('window:keydown.arrowdown', ['$event'])
  @HostListener('window:keydown.enter', ['$event'])
  public handleInput($event: MouseEvent | WheelEvent | KeyboardEvent, index?: number): boolean {
    if ($event instanceof KeyboardEvent) {
      this.handleKeyboardInput($event);
    } else if ($event instanceof WheelEvent) {
      this.handleWheelInput($event);
    } else if ($event instanceof MouseEvent) {
      this.handleMouseInput($event, index);
    }
    return false;
  }

  /**
   * Activate menu item.
   *
   * @param index Menu item index.
   */
  private activateMenuItem(index: number): boolean {
    if (!this.menuItems[index].disabled) {
      this.menuItems[index].activate();
      return true;
    }
    return false;
  }

  /**
   * Handle keyboard input.
   *
   * @param $event DOM event object.
   */
  private handleKeyboardInput($event: KeyboardEvent): void {
    switch ($event.key) {
      case 'ArrowUp':
        this.traverseToNextMenuItem(-1);
        break;
      case 'ArrowDown':
        this.traverseToNextMenuItem(1);
        break;
      case 'Enter':
        this.activateMenuItem(this.currentMenuItemIndex);
        break;
      default:
        break;
    }
  }

  /**
   * Handle mouse input.
   *
   * @param $event DOM event object.
   * @param index Menu item index.
   */
  private handleMouseInput($event: MouseEvent, index: number): void {
    switch ($event.type) {
      case 'click':
        if (this.selectMenuItem(index)) {
          this.activateMenuItem(index);
        }
        break;
      case 'mouseover':
        this.selectMenuItem(index);
        break;
      default:
        break;
    }
  }

  /**
   * Handle wheel input.
   *
   * @param event DOM event object.
   */
  private handleWheelInput($event: WheelEvent): void {
    const delta = $event.wheelDelta;

    if (delta > 0) {
      this.traverseToNextMenuItem(-1);
    } else if (delta < 0) {
      this.traverseToNextMenuItem(1);
    }
  }

  /**
   * Normalize menu item index to value in valid range.
   *
   * @param index Menu item index.
   */
  private normalizeIndex(index: number): number {
    const len = this.menuItems.length;
    index = index % len;
    return index < 0 ? len + index : index;
  }

  /**
   * Select menu item.
   *
   * @param index Menu item index.
   */
  private selectMenuItem(index: number): boolean {
    if (!this.menuItems[index].disabled) {
      this.menuItems[this.currentMenuItemIndex].selected = false;
      this.menuItems[index].selected = true;
      this.currentMenuItemIndex = index;
      return true;
    }
    return false;
  }

  /**
   * Traverse to next menu item.
   *
   * @param step Magnitude & direction to traverse.
   */
  private traverseToNextMenuItem(step: number): boolean {
    if (this.currentMenuItemIndex === -1) {
      return false;
    }

    let index = this.normalizeIndex(this.currentMenuItemIndex + step);

    do {
      if (this.selectMenuItem(index)) {
        return true;
      }

      index = this.normalizeIndex(index + step);
    } while (index !== this.currentMenuItemIndex);

    return false;
  }
}

/**
 * Menu items.
 */
export type MenuItems = MenuItem[];

/**
 * Menu item.
 */
export interface MenuItem {
  /**
   * Menu item title.
   */
  title: string;

  /**
   * Menu item activation handler.
   */
  activate: () => void;

  /**
   * Menu item disabled flag.
   */
  disabled?: boolean;

  /**
   * Menu item selected flag.
   */
  selected?: boolean;

  /**
   * Material icon name.
   */
  icon?: string;
}

