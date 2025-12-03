import { createFocusTrap } from '../../utilities/focus-trap.js';
import { setupExternalTriggers } from '../../utilities/trigger-manager.js';

/**
 * A dialog base class that extends the native HTMLDialogElement.
 * Provides body scroll locking and integrates with the Disclosure API pattern.
 * Inherits all native dialog benefits: backdrop, focus trap, ESC handling, top layer.
 *
 * @class DialogBase
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

export class DialogBase extends HTMLDialogElement {
  constructor() {
    super();
    this._cleanupFocusTrap = null;
    this._cleanupExternalTriggers = null;
    this._cleanupCloseButtons = [];

    // Bind event handlers to store references for cleanup
    this._handleClose = () => {
      this._unlockBodyScroll();

      // Clean up focus trap if it was set up
      if (this._cleanupFocusTrap) {
        this._cleanupFocusTrap();
        this._cleanupFocusTrap = null;
      }
    };

    this._handleBackdropClick = (e) => {
      if (e.target === this) {
        this.hide();
      }
    };
  }

  connectedCallback() {
    this._setupCloseButtons();
    this._setupExternalTriggers();

    // Listen for native close event (ESC key, hide(), or programmatic close)
    this.addEventListener('close', this._handleClose);

    // Handle backdrop clicks
    this.addEventListener('click', this._handleBackdropClick);
  }

  /**
   * Sets up click handlers for internal close button elements.
   * Caches buttons to avoid re-querying on every connection.
   * @private
   */
  _setupCloseButtons() {
    const closeButtons = this.querySelectorAll('[data-close-dialog]');
    const handleClick = () => this.hide();

    closeButtons.forEach((button) => {
      button.addEventListener('click', handleClick);
      // Store cleanup function
      this._cleanupCloseButtons.push(() => {
        button.removeEventListener('click', handleClick);
      });
    });
  }

  /**
   * Sets up click handlers for external elements that control this dialog.
   * Uses trigger manager utility for proper cleanup.
   * @private
   */
  _setupExternalTriggers() {
    // Use trigger manager utility for automatic cleanup
    this._cleanupExternalTriggers = setupExternalTriggers(this.id, () =>
      this.show()
    );
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
      this.close();
    }
  }

  /**
   * Locks body scroll when dialog is open.
   * @private
   */
  _lockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Unlocks body scroll when dialog closes.
   * @private
   */
  _unlockBodyScroll() {
    document.body.style.overflow = '';
  }

  disconnectedCallback() {
    // Remove event listeners
    this.removeEventListener('close', this._handleClose);
    this.removeEventListener('click', this._handleBackdropClick);

    // Clean up close button listeners
    this._cleanupCloseButtons.forEach((fn) => fn());
    this._cleanupCloseButtons = [];

    // Clean up external trigger listeners (fixes memory leak)
    if (this._cleanupExternalTriggers) {
      this._cleanupExternalTriggers();
      this._cleanupExternalTriggers = null;
    }

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
