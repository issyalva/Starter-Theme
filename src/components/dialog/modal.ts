import { DialogBase } from './dialog-base.js';

/**
 * A modal component that appears centered on the screen.
 * Extends the native HTMLDialogElement with centered positioning.
 *
 * @example
 * <button aria-controls="example-modal">Open Modal</button>
 * <dialog is="ui-modal" id="example-modal">
 *   <h2>Modal Title</h2>
 *   <button data-close-dialog>Close</button>
 *   <p>Modal content goes here</p>
 * </dialog>
 */
export class Modal extends DialogBase {}

if (!customElements.get('ui-modal')) {
	customElements.define('ui-modal', Modal, { extends: 'dialog' });
}
