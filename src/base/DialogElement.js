import { ToggleElement } from './ToggleElement.js';

/**
 * A dialog base class that extends ToggleElement with dialog-specific functionality.
 * Provides ARIA dialog semantics, backdrop overlay, and body scroll locking.
 *
 * @class DialogElement
 * @extends {ToggleElement}
 *
 * @example
 * // Extend DialogElement for custom dialog components
 * class Modal extends DialogElement {
 *   // Add modal-specific functionality
 * }
 */
export class DialogElement extends ToggleElement {
  constructor() {
    super();
    this._backdrop = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._createBackdrop();
    this._setDialogAttributes();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeBackdrop();
  }

  /**
   * Sets required ARIA attributes for dialog accessibility.
   * @private
   */
  _setDialogAttributes() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    
    // Set aria-labelledby if there's an element with id matching dialog-id-label
    // Otherwise, set a default aria-label
    const labelId = `${this.id}-label`;
    const labelElement = this.querySelector(`#${labelId}`);
    
    if (labelElement) {
      this.setAttribute('aria-labelledby', labelId);
    } else if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Dialog');
    }
  }

  /**
   * Creates and manages the backdrop overlay.
   * @private
   */
  _createBackdrop() {
    if (this._backdrop) return;

    this._backdrop = document.createElement('div');
    this._backdrop.className = 'dialog-backdrop';
    this._backdrop.setAttribute('aria-hidden', 'true');
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
   * Lifecycle hook called when the dialog opens.
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
   * Lifecycle hook called when the dialog closes.
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
