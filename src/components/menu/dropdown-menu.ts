import { Disclosure } from '../disclosure/disclosure.js';

/**
 * DropdownMenu extends Disclosure to add dropdown-specific functionality.
 * Includes keyboard navigation, focus management, and ARIA roles.
 */
export class DropdownMenu extends Disclosure {
  private _localCleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._bindDropdownKeyboardNavigation();
    this._bindTriggerKeyboardNavigation();
  }

  disconnectedCallback(): void {
    this._runLocalCleanup();

    super.disconnectedCallback();
  }

  private _bindTriggerKeyboardNavigation(): void {
    if (!this.id) return;

    const triggers = Array.from(
      document.querySelectorAll(`[aria-controls="${this.id}"]`)
    ).filter((el): el is HTMLElement => el instanceof HTMLElement);

    triggers.forEach((trigger) => {
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

    if (e.key === 'ArrowDown') {
      this._focusRelativeItem(1, -1);
      return;
    }

    this._focusRelativeItem(-1, 0);
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
        this._focusRelativeItem(1, -1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusRelativeItem(-1, 0);
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

  private _focusRelativeItem(offset: number, fallbackIndex: number): void {
    const menuItems = this._getMenuItems();
    if (menuItems.length === 0) return;

    const activeElement = document.activeElement;
    const currentIndex = activeElement
      ? menuItems.indexOf(activeElement as HTMLElement)
      : -1;
    const baseIndex = currentIndex === -1 ? fallbackIndex : currentIndex;
    const nextIndex = (baseIndex + offset + menuItems.length) % menuItems.length;

    menuItems[nextIndex].focus();
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