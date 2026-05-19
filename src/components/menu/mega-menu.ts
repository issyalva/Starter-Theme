import { Disclosure } from '../disclosure/disclosure.js';

/**
 * MegaMenu extends Disclosure for large navigation panels containing mixed
 * interactive content such as links, images, and call-to-action buttons.
 */
export class MegaMenu extends Disclosure {
  private _trigger: HTMLElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._bindPanelBehavior();
    this._bindTriggerKeyboardNavigation();
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this._onPanelKeydown);
    this.removeEventListener('focusout', this._onPanelFocusout);

    this._trigger?.removeEventListener('keydown', this._onTriggerKeydown);
    this._trigger = null;

    super.disconnectedCallback();
  }

  private _bindPanelBehavior(): void {
    this.addEventListener('keydown', this._onPanelKeydown);
    this.addEventListener('focusout', this._onPanelFocusout);
  }

  private _bindTriggerKeyboardNavigation(): void {
    if (!this.id) return;

    const trigger = document.querySelector(
      `[aria-controls="${this.id}"]`
    );

    if (trigger instanceof HTMLElement) {
      this._trigger = trigger;
      this._trigger.addEventListener('keydown', this._onTriggerKeydown);
    }
  }

  private _onTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    e.preventDefault();

    if (!this.open) {
      this.show();
    }

    if (e.key === 'ArrowDown') {
      this._focusFirstFocusable();
      return;
    }

    this._focusLastFocusable();
  };

  private _onPanelKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
      this._focusTrigger();
    }
  };

  private _onPanelFocusout = (e: FocusEvent): void => {
    if (!this.contains(e.relatedTarget as Node)) {
      this.hide();
    }
  };

  private _focusFirstFocusable(): void {
    const firstFocusable = this.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  }

  private _focusLastFocusable(): void {
    const focusableElements = Array.from(
      this.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }

  private _focusTrigger(): void {
    this._trigger?.focus();
  }
}

if (!customElements.get('mega-menu')) {
  customElements.define('mega-menu', MegaMenu);
}
