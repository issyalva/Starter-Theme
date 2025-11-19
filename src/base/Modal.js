import { DialogElement } from './DialogElement.js';

/**
 * A modal component that appears centered on the screen.
 * Extends DialogElement with centered positioning.
 *
 * @class Modal
 * @extends {DialogElement}
 *
 * @example
 * <button aria-controls="example-modal">Open Modal</button>
 * <ui-modal id="example-modal">
 *   <div>
 *     <h2 id="example-modal-label">Modal Title</h2>
 *     <button data-trigger>Close</button>
 *     <p>Modal content goes here</p>
 *   </div>
 * </ui-modal>
 */
export class Modal extends DialogElement {
  // Modal-specific implementation is minimal
  // All dialog functionality inherited from DialogElement
  // Positioning handled by CSS
}

customElements.define('ui-modal', Modal);
