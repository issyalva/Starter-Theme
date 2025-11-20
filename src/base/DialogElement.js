import { createFocusTrap } from '../utilities/focusTrap.js';

/**
 * A dialog base class that extends the native HTMLDialogElement.
 * Provides body scroll locking and integrates with the ToggleElement API pattern.
 * Inherits all native dialog benefits: backdrop, focus trap, ESC handling, top layer.
 *
 * @class DialogElement
 * @extends {HTMLDialogElement}
 *
 * @example
 * // Use with 'is' attribute to extend native dialog
 * <dialog is="ui-modal" id="example-modal">
 *   <h2>Modal Title</h2>
 *   <button data-close-dialog>Close</button>
 * </dialog>
 *
 * @example
 * // With opt-in strict focus trapping
 * <dialog is="ui-modal" id="example-modal" focus-trap>
 *   <h2>Modal Title</h2>
 *   <button data-close-dialog>Close</button>
 * </dialog>
 */

export class DialogElement extends HTMLDialogElement {
  constructor() {
    super();
    this._cleanupFocusTrap = null;
  }

  connectedCallback() {
    this._setupCloseButtons();
    this._setupExternalTriggers();

    // Listen for native close event (ESC key)
    this.addEventListener('close', () => {
      this._unlockBodyScroll();
    });

    // Handle backdrop clicks
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.hide();
      }
    });
  }

  /**
   * Sets up click handlers for internal close button elements.
   * @private
   */
  _setupCloseButtons() {
    const closeButtons = this.querySelectorAll('[data-close-dialog]');
    closeButtons.forEach((button) => {
      button.addEventListener('click', () => this.hide());
    });
  }

  /**
   * Sets up click handlers for external elements that control this dialog.
   * @private
   */
  _setupExternalTriggers() {
    if (!this.id) return;

    // Find all elements with aria-controls pointing to this dialog
    const externalTriggers = document.querySelectorAll(
      `[aria-controls="${this.id}"]`
    );
    externalTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.show());
    });
  }

  /**
   * Shows the dialog as a modal.
   */
  show() {
    if (!this.open) {
      this.showModal();
      this._lockBodyScroll();
      this._setupOptionalFocusTrap();
    }
  }

  /**
   * Sets up strict focus trapping if the focus-trap attribute is present.
   * @private
   */
  _setupOptionalFocusTrap() {
    if (this.hasAttribute('focus-trap')) {
      this._cleanupFocusTrap = createFocusTrap(this, true);
    }
  }

  /**
   * Hides the dialog.
   */
  hide() {
    if (this.open) {
      this._unlockBodyScroll();

      // Clean up focus trap if it was set up
      if (this._cleanupFocusTrap) {
        this._cleanupFocusTrap();
        this._cleanupFocusTrap = null;
      }

      this.close();
    }
  }

  /**
   * Locks body scroll when dialog is open.
   * @private
   */
  _lockBodyScroll() {
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Unlocks body scroll when dialog closes.
   * @private
   */
  _unlockBodyScroll() {
    document.body.classList.remove('overflow-hidden');
  }

  disconnectedCallback() {
    // Clean up focus trap if element is removed
    if (this._cleanupFocusTrap) {
      this._cleanupFocusTrap();
      this._cleanupFocusTrap = null;
    }

    if (this.open) {
      this.close();
    }
  }
}
