import { Disclosure } from '../disclosure/disclosure.js';

/**
 * DropdownMenu extends Disclosure to add dropdown-specific functionality.
 * Includes keyboard navigation, focus management, and ARIA roles.
 */
export class DropdownMenu extends Disclosure {
  private _menuItems: HTMLElement[] = [];
  private _externalTriggers: HTMLElement[] = [];
  private _currentIndex: number = -1;
  private _localCleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._cacheMenuItems();
    this._bindDropdownKeyboardNavigation();
    this._bindTriggerKeyboardNavigation();
  }

  disconnectedCallback(): void {
    this._runLocalCleanup();

    this._externalTriggers = [];
    this._menuItems = [];
    this._currentIndex = -1;

    super.disconnectedCallback();
  }

  onOpen(): void {
    super.onOpen();
    this._cacheMenuItems();
    this._currentIndex = -1;
  }

  private _cacheMenuItems(): void {
    this._menuItems = Array.from(this.querySelectorAll('[role="menuitem"]'));
  }

  private _bindTriggerKeyboardNavigation(): void {
    if (!this.id) return;

    this._externalTriggers = Array.from(
      document.querySelectorAll(`[aria-controls="${this.id}"]`)
    ).filter((el): el is HTMLElement => el instanceof HTMLElement);

    this._externalTriggers.forEach((trigger) => {
      trigger.addEventListener('keydown', this._onTriggerKeydown);
      this._addLocalCleanup(() => {
        trigger.removeEventListener('keydown', this._onTriggerKeydown);
      });
    });
  }

  private _onTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    e.preventDefault();

    if (!this.open) {
      this.show();
    }

    this._cacheMenuItems();

    if (e.key === 'ArrowDown') {
      this._currentIndex = -1;
      this._focusNextItem();
      return;
    }

    this._currentIndex = 0;
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
    if (!this.open || this._menuItems.length === 0) return;

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

  private _focusNextItem(): void {
    if (this._menuItems.length === 0) return;
    this._currentIndex = (this._currentIndex + 1) % this._menuItems.length;
    this._menuItems[this._currentIndex].focus();
  }

  private _focusPreviousItem(): void {
    if (this._menuItems.length === 0) return;
    this._currentIndex = (this._currentIndex - 1 + this._menuItems.length) % this._menuItems.length;
    this._menuItems[this._currentIndex].focus();
  }

  private _focusTrigger(): void {
    const trigger = this._cachedTriggers?.[0];
    if (trigger instanceof HTMLElement) {
      trigger.focus();
    }
  }
}

if (!customElements.get('dropdown-menu')) {
  customElements.define('dropdown-menu', DropdownMenu);
}