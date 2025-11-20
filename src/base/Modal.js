import { DialogElement } from './DialogElement.js';

/**
 * A modal component that appears centered on the screen.
 * Extends the native HTMLDialogElement with centered positioning.
 *
 * @class Modal
 * @extends {DialogElement}
 *
 * @example
 * <button onclick="document.getElementById('example-modal').show()">Open Modal</button>
 * <dialog is="ui-modal" id="example-modal">
 *   <h2 id="example-modal-label">Modal Title</h2>
 *   <button data-trigger>Close</button>
 *   <p>Modal content goes here</p>
 * </dialog>
 */
export class Modal extends DialogElement {
  // Modal-specific implementation is minimal
  // All dialog functionality inherited from DialogElement
  // Positioning handled by CSS
}

customElements.define('ui-modal', Modal, { extends: 'dialog' });
