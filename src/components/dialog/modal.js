import { DialogBase } from './dialog-base.js';

/**
 * A modal component that appears centered on the screen.
 * Extends the native HTMLDialogElement with centered positioning.
 *
 * @class Modal
 * @extends {DialogBase}
 *
 * @example
 * <button onclick="document.getElementById('example-modal').show()">Open Modal</button>
 * <dialog is="ui-modal" id="example-modal">
 *   <h2 id="example-modal-label">Modal Title</h2>
 *   <button data-trigger>Close</button>
 *   <p>Modal content goes here</p>
 * </dialog>
 */
export class Modal extends DialogBase {
  // Modal-specific implementation is minimal
  // All dialog functionality inherited from DialogBase
  // Positioning handled by CSS
}

customElements.define('ui-modal', Modal, { extends: 'dialog' });
