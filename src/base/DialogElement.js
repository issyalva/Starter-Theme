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
 *   <button data-trigger>Close</button>
 * </dialog>
 *
 * @example
 * // With opt-in strict focus trapping
 * <dialog is="ui-modal" id="example-modal" focus-trap>
 *   <h2>Modal Title</h2>
 *   <button data-trigger>Close</button>
 * </dialog>
 */
export class DialogElement extends HTMLDialogElement {
  constructor() {
    super();
    this._cleanupFocusTrap = null;
  }

  connectedCallback() {
    this._setupTriggers();
    this._setupAccessibility();
    this._setupExternalTriggers();

    // Listen for native close event (ESC key)
    this.addEventListener('close', () => {
      this._onClose();
    });

    // Handle backdrop clicks
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.hide();
      }
    });
  }

  /**
   * Sets up click handlers for internal trigger elements.
   * @private
   */
  _setupTriggers() {
    const triggers = this.querySelectorAll('[data-trigger]');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.hide());
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
   * Sets up ARIA attributes for accessibility.
   * @private
   */
  _setupAccessibility() {
    const labelId = `${this.id}-label`;
    const labelElement = this.querySelector(`#${labelId}`);

    if (labelElement) {
      this.setAttribute('aria-labelledby', labelId);
    } else if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Dialog');
    }
  }

  /**
   * Shows the dialog as a modal.
   */
  show() {
    if (!this.open) {
      this.showModal();
      // Trigger reflow to ensure transition happens
      requestAnimationFrame(() => {
        this._onOpen();
        this._setupOptionalFocusTrap();
      });
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
      this._onClose();

      // Clean up focus trap if it was set up
      if (this._cleanupFocusTrap) {
        this._cleanupFocusTrap();
        this._cleanupFocusTrap = null;
      }

      // Wait for close animation before actually closing
      // Use transitionend event to know when animation completes
      const handleTransitionEnd = (e) => {
        // Only close if the transition was on this element
        if (e.target === this) {
          this.close();
          this.removeEventListener('transitionend', handleTransitionEnd);
        }
      };
      this.addEventListener('transitionend', handleTransitionEnd);

      // Fallback timeout in case transitionend doesn't fire
      setTimeout(() => {
        if (this.open) {
          this.close();
          this.removeEventListener('transitionend', handleTransitionEnd);
        }
      }, 350);
    }
  }

  /**
   * Called when dialog opens.
   * @private
   */
  _onOpen() {
    document.body.classList.add('overflow-hidden');
    this.setAttribute('data-open', '');
  }

  /**
   * Called when dialog closes.
   * @private
   */
  _onClose() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('data-open');
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
