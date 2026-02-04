import { createFocusTrap } from '../../utilities/focus-trap.js';
import { setupExternalTriggers } from '../../utilities/trigger-manager.js';

/**
 * A dialog base class that extends the native HTMLDialogElement.
 * Provides body scroll locking and integrates with the Disclosure API pattern.
 * Inherits all native dialog benefits: backdrop, focus trap, ESC handling, top layer.
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
  private _cleanupFocusTrap: (() => void) | null = null;
  private _cleanupExternalTriggers: (() => void) | null = null;
  private _cleanupCloseButtons: (() => void)[] = [];
  private _handleClose: () => void;
  private _handleBackdropClick: (e: Event) => void;

  constructor() {
    super();

    this._handleClose = (): void => {
      this._unlockBodyScroll();

      if (this._cleanupFocusTrap) {
        this._cleanupFocusTrap();
        this._cleanupFocusTrap = null;
      }
    };

    this._handleBackdropClick = (e: Event): void => {
      if (e.target === this) {
        this.hide();
      }
    };
  }

  connectedCallback(): void {
    this._setupCloseButtons();
    this._setupExternalTriggers();

    this.addEventListener('close', this._handleClose);
    this.addEventListener('click', this._handleBackdropClick);
  }

  /**
   * Binds event listeners to internal close buttons.
   * Internal close buttons (data-close-dialog) provide a way to close the dialog
   * from within its content, independent of native ESC key or backdrop click handling.
   */
  private _setupCloseButtons(): void {
    const closeButtons = this.querySelectorAll('[data-close-dialog]');
    const handleClick = (): void => this.hide();

    closeButtons.forEach((button) => {
      button.addEventListener('click', handleClick);
      this._cleanupCloseButtons.push(() => {
        button.removeEventListener('click', handleClick);
      });
    });
  }

  /**
   * Binds event listeners to external trigger elements.
   * External triggers (aria-controls) allow other elements to open this dialog,
   * enabling declarative control without JavaScript.
   */
  private _setupExternalTriggers(): void {
    this._cleanupExternalTriggers = setupExternalTriggers(this.id, () =>
      this.show()
    );
  }

  /**
   * Shows the dialog as a modal.
   */
  show(): void {
    if (!this.open) {
      this.showModal();
      this._lockBodyScroll();
      this._setupOptionalFocusTrap();
    }
  }

  /**
   * Enables strict focus trapping when the focus-trap attribute is present.
   * Native dialogs already trap focus, but this enforces stricter boundaries
   * by preventing focus from escaping even through programmatic means.
   */
  private _setupOptionalFocusTrap(): void {
    if (this.hasAttribute('focus-trap')) {
      this._cleanupFocusTrap = createFocusTrap(this, true);
    }
  }

  /**
   * Hides the dialog.
   */
  hide(): void {
    if (this.open) {
      this.close();
    }
  }

  private _lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private _unlockBodyScroll(): void {
    document.body.style.overflow = '';
  }

  disconnectedCallback(): void {
    this.removeEventListener('close', this._handleClose);
    this.removeEventListener('click', this._handleBackdropClick);

    this._cleanupCloseButtons.forEach((fn) => fn());
    this._cleanupCloseButtons = [];

    if (this._cleanupExternalTriggers) {
      this._cleanupExternalTriggers();
      this._cleanupExternalTriggers = null;
    }

    if (this._cleanupFocusTrap) {
      this._cleanupFocusTrap();
      this._cleanupFocusTrap = null;
    }

    if (this.open) {
      this.close();
    }
  }
}
