import { Disclosure } from '../disclosure/disclosure.js';

/**
 * DropdownMenu extends Disclosure to add dropdown-specific functionality.
 * Includes keyboard navigation, focus management, and ARIA roles.
 */
export class DropdownMenu extends Disclosure {
  private _localCleanupFns: (() => void)[] = [];
  private _trigger: HTMLElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._bindDropdownKeyboardNavigation();
    this._bindTriggerKeyboardNavigation();
  }

  disconnectedCallback(): void {
    this._runLocalCleanup();
    this._trigger = null;

    super.disconnectedCallback();
  }

  private _bindTriggerKeyboardNavigation(): void {
    if (!this.id) return;

    const trigger = document.querySelector(`[aria-controls="${this.id}"]`);
    if (!(trigger instanceof HTMLElement)) return;

    this._trigger = trigger;
    this._trigger.addEventListener('keydown', this._onTriggerKeydown);
    this._addLocalCleanup(() => {
      this._trigger?.removeEventListener('keydown', this._onTriggerKeydown);
    });
  }

  private _onTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    e.preventDefault();

    if (!this.open) {
      this.show();
    }

    if (e.key === 'ArrowDown') {
      this._focusNextItem();
      return;
    }

    this._focusPreviousItem();
  };

  private _bindDropdownKeyboardNavigation(): void {
    this.addEventListener('keydown', this._onDropdownKeydown);
    this.addEventListener('focusout', this._onDropdownFocusout);

    this._addLocalCleanup(() => {
      this.removeEventListener('keydown', this._onDropdownKeydown);
    });
    this._addLocalCleanup(() => {
      this.removeEventListener('focusout', this._onDropdownFocusout);
    });
  }

  private _onDropdownKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusNextItem();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusPreviousItem();
        break;
      case 'Escape':
        e.preventDefault();
        this.hide();
        this._focusTrigger();
        break;
      default:
        break;
    }
  };

  private _onDropdownFocusout = (e: FocusEvent): void => {
    if (!this.contains(e.relatedTarget as Node)) {
      this.hide();
    }
  };

  private _addLocalCleanup(cleanup: () => void): void {
    this._localCleanupFns.push(cleanup);
  }

  private _runLocalCleanup(): void {
    this._localCleanupFns.forEach((cleanup) => cleanup());
    this._localCleanupFns = [];
  }

  private _getMenuItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll('[role="menuitem"]')).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
  }

  private _focusNextItem(): void {
    const menuItems = this._getMenuItems();
    if (menuItems.length === 0) return;

    const currentIndex = this._getCurrentMenuItemIndex(menuItems);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % menuItems.length;

    menuItems[nextIndex].focus();
  }

  private _focusPreviousItem(): void {
    const menuItems = this._getMenuItems();
    if (menuItems.length === 0) return;

    const currentIndex = this._getCurrentMenuItemIndex(menuItems);
    const previousIndex =
      currentIndex < 0
        ? menuItems.length - 1
        : (currentIndex - 1 + menuItems.length) % menuItems.length;

    menuItems[previousIndex].focus();
  }

  private _getCurrentMenuItemIndex(menuItems: HTMLElement[]): number {
    const activeElement = document.activeElement;
    return activeElement
      ? menuItems.indexOf(activeElement as HTMLElement)
      : -1;
  }
  private _focusTrigger(): void {
    this._trigger?.focus();
  }
}

if (!customElements.get('dropdown-menu')) {
  customElements.define('dropdown-menu', DropdownMenu);
}