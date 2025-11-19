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
    this._setDialogAttributes();
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
   * Creates the backdrop overlay when dialog opens.
   * @private
   */
  _createBackdrop() {
    this._backdrop = document.createElement('div');
    this._backdrop.className = 'dialog-backdrop';
    this._backdrop.setAttribute('aria-hidden', 'true');
    this._backdrop.addEventListener('click', () => this.hide());
    document.body.appendChild(this._backdrop);
    
    // Trigger transition after element is in DOM
    requestAnimationFrame(() => {
      this._backdrop.classList.add('active');
    });
  }

  /**
   * Removes the backdrop overlay when dialog closes.
   * @private
   */
  _removeBackdrop() {
    if (!this._backdrop) return;
    
    this._backdrop.classList.remove('active');
    
    // Wait for transition to complete before removing from DOM
    setTimeout(() => {
      this._backdrop?.remove();
      this._backdrop = null;
    }, 300); // Match CSS transition duration
  }

  /**
   * Lifecycle hook called when the dialog opens.
   * Creates backdrop and locks body scroll.
   */
  onOpen() {
    super.onOpen();
    this._createBackdrop();
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Lifecycle hook called when the dialog closes.
   * Removes backdrop and unlocks body scroll.
   */
  onClose() {
    super.onClose();
    this._removeBackdrop();
    document.body.classList.remove('overflow-hidden');
  }
}
