import { ToggleElement } from './ToggleElement.js';

/**
 * A drawer component that slides in from the left or right side of the screen.
 * Includes a backdrop overlay that closes the drawer when clicked.
 *
 * @class Drawer
 * @extends {ToggleElement}
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
export class Drawer extends ToggleElement {
  constructor() {
    super();
    this._backdrop = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._createBackdrop();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeBackdrop();
  }



  /**
   * Creates and manages the backdrop overlay.
   * @private
   */
  _createBackdrop() {
    if (this._backdrop) return;

    this._backdrop = document.createElement('div');
    this._backdrop.className = 'drawer-backdrop';
    this._backdrop.addEventListener('click', () => this.hide());
    document.body.appendChild(this._backdrop);
  }

  /**
   * Removes the backdrop from the DOM.
   * @private
   */
  _removeBackdrop() {
    if (this._backdrop) {
      this._backdrop.remove();
      this._backdrop = null;
    }
  }



  /**
   * Lifecycle hook called when the drawer opens.
   * Shows the backdrop and prevents body scroll.
   */
  onOpen() {
    super.onOpen();
    if (this._backdrop) {
      this._backdrop.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  /**
   * Lifecycle hook called when the drawer closes.
   * Hides the backdrop and restores body scroll.
   */
  onClose() {
    super.onClose();
    if (this._backdrop) {
      this._backdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
  }
}

customElements.define('ui-drawer', Drawer);
