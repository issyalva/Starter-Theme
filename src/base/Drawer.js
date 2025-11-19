import { ToggleElement } from './ToggleElement.js';

/**
 * A drawer component that extends ToggleElement with drawer-specific functionality.
 *
 * @class Drawer
 * @extends {ToggleElement}
 *
 * @example
 * <button aria-controls="my-drawer">Open Drawer</button>
 * <ui-drawer id="my-drawer">
 *   <div>
 *     <button data-trigger>Close</button>
 *     <p>Drawer content</p>
 *   </div>
 * </ui-drawer>
 */

export class Drawer extends ToggleElement {
  /**
   * Creates an instance of Drawer.
   */
  constructor() {
    super();
  }

  /**
   * Called when the drawer element is added to the DOM.
   * Sets up drawer-specific functionality.
   */
  connectedCallback() {
    super.connectedCallback();
    console.log('Drawer connected');
    // Add drawer-specific setup here
  }
}

customElements.define('ui-drawer', Drawer);
