import { DialogElement } from './DialogElement.js';

/**
 * A drawer component that slides in from the left or right side of the screen.
 * Extends DialogElement with slide-in positioning.
 *
 * @class Drawer
 * @extends {DialogElement}
 *
 * @example
 * <!-- Drawer from left (default) -->
 * <button aria-controls="menu-drawer">Open Menu</button>
 * <ui-drawer id="menu-drawer">
 *   <div>
 *     <button data-trigger>Close</button>
 *     <nav>Navigation items</nav>
 *   </div>
 * </ui-drawer>
 *
 * @example
 * <!-- Drawer from right (for cart) -->
 * <button aria-controls="cart-drawer">Open Cart</button>
 * <ui-drawer id="cart-drawer" side="right">
 *   <div>
 *     <button data-trigger>Close</button>
 *     <div>Cart items</div>
 *   </div>
 * </ui-drawer>
 */
export class Drawer extends DialogElement {
  // Drawer-specific implementation is now minimal
  // All dialog functionality inherited from DialogElement
}

customElements.define('ui-drawer', Drawer);
