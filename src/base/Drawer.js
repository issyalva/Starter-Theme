import { DialogElement } from './DialogElement.js';

/**
 * A drawer component that slides in from the left or right side of the screen.
 * Extends the native HTMLDialogElement with slide-in positioning.
 *
 * @class Drawer
 * @extends {DialogElement}
 *
 * @example
 * <!-- Drawer from left (default) -->
 * <button onclick="document.getElementById('menu-drawer').show()">Open Menu</button>
 * <dialog is="ui-drawer" id="menu-drawer">
 *   <button data-trigger>Close</button>
 *   <nav>Navigation items</nav>
 * </dialog>
 *
 * @example
 * <!-- Drawer from right (for cart) -->
 * <button onclick="document.getElementById('cart-drawer').show()">Open Cart</button>
 * <dialog is="ui-drawer" id="cart-drawer" side="right">
 *   <button data-trigger>Close</button>
 *   <div>Cart items</div>
 * </dialog>
 */
export class Drawer extends DialogElement {
  // Drawer-specific implementation is minimal
  // All dialog functionality inherited from DialogElement
}

customElements.define('ui-drawer', Drawer, { extends: 'dialog' });
