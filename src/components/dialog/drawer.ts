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
export class Drawer extends DialogBase {}

customElements.define('ui-drawer', Drawer, { extends: 'dialog' });
