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

  private readonly _onAnimationEnd = (event: Event): void => {
    if (!(event instanceof AnimationEvent)) return;
    if (!this._isClosing || event.target !== this) return;
    if (!event.animationName.startsWith('drawer-exit-')) return;

    this.removeAttribute('data-closing');
    this._isClosing = false;

    super.close();
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('animationend', this._onAnimationEnd);
  }

  disconnectedCallback(): void {
    this.removeEventListener('animationend', this._onAnimationEnd);
    this.removeAttribute('data-closing');
    this._isClosing = false;
    super.disconnectedCallback();
  }

  close(): void {
    if (!this.open || this._isClosing) return;

    const shouldAnimate = !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!shouldAnimate) {
      super.close();
      return;
    }

    this._isClosing = true;
    this.setAttribute('data-closing', '');
  }
}

if (!customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', Drawer, { extends: 'dialog' });
}
