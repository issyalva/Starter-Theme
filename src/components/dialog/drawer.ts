import { DialogBase } from './dialog-base.js';

/**
 * A drawer component that slides in from the left or right side of the screen.
 * Extends the native HTMLDialogElement with slide-in positioning.
 *
 * @example
 * <button aria-controls="menu-drawer">Open Menu</button>
 * <dialog is="ui-drawer" id="menu-drawer">
 *   <button data-close-dialog>Close</button>
 *   <nav>Navigation items</nav>
 * </dialog>
 *
 * @example
 * <button aria-controls="cart-drawer">Open Cart</button>
 * <dialog is="ui-drawer" id="cart-drawer" side="right">
 *   <button data-close-dialog>Close</button>
 *   <div>Cart items</div>
 * </dialog>
 */
export class Drawer extends DialogBase {
  private _isClosing = false;

  private _resetClosingState(): void {
    this.removeAttribute('data-closing');
    this._isClosing = false;
  }

  private readonly _onCancel = (event: Event): void => {
    event.preventDefault();
    this.close();
  };

  private readonly _onDrawerClose = (): void => {
    this._resetClosingState();
  };

  private readonly _onAnimationEnd = (event: Event): void => {
    if (!(event instanceof AnimationEvent)) return;
    if (!this._isClosing || event.target !== this) return;
    if (!event.animationName.startsWith('drawer-exit-')) return;

    this._resetClosingState();

    super.close(this.returnValue);
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('cancel', this._onCancel);
    this.addEventListener('close', this._onDrawerClose);
    this.addEventListener('animationend', this._onAnimationEnd);
  }

  disconnectedCallback(): void {
    this.removeEventListener('cancel', this._onCancel);
    this.removeEventListener('close', this._onDrawerClose);
    this.removeEventListener('animationend', this._onAnimationEnd);
    this._resetClosingState();
    super.disconnectedCallback();
  }

  close(returnValue?: string): void {
    if (returnValue !== undefined) {
      this.returnValue = returnValue;
    }

    if (!this.open || this._isClosing) return;

    const shouldAnimate = !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!shouldAnimate) {
      super.close(this.returnValue);
      return;
    }

    this._isClosing = true;
    this.setAttribute('data-closing', '');
  }
}

if (!customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', Drawer, { extends: 'dialog' });
}
