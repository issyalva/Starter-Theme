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
  private _cleanupFns: (() => void)[] = [];
  private _cleanupFocusTrap: (() => void) | null = null;

  private readonly _onClose = (): void => {
    this._unlockBodyScroll();

    if (this._cleanupFocusTrap) {
      this._cleanupFocusTrap();
      this._cleanupFocusTrap = null;
    }
  };

  private readonly _onBackdropClick = (e: Event): void => {
    if (e.target === this) {
      this.close();
    }
  };

  connectedCallback(): void {
    this._setupCloseButtons();
    this._setupExternalTriggers();

    this.addEventListener('close', this._onClose);
    this._cleanupFns.push(() => this.removeEventListener('close', this._onClose));

    this.addEventListener('click', this._onBackdropClick);
    this._cleanupFns.push(() =>
      this.removeEventListener('click', this._onBackdropClick)
    );
  }

  /**
   * Binds event listeners to internal close buttons.
   * Provides a way to close from within the dialog content, independent of native ESC/backdrop handling.
   */
  private _setupCloseButtons(): void {
    const closeButtons = this.querySelectorAll('[data-close-dialog]');
    const onClick = (): void => this.close();

    closeButtons.forEach((button) => {
      button.addEventListener('click', onClick);
      this._cleanupFns.push(() => {
        button.removeEventListener('click', onClick);
      });
    });
  }

  /**
   * Binds event listeners to external trigger elements.
   * Enables declarative control via aria-controls without requiring JavaScript.
   */
  private _setupExternalTriggers(): void {
    this._cleanupFns.push(setupExternalTriggers(this.id, () => this.show()));
  }

  show(): void {
    if (!this.open) {
      this.showModal();
      this._lockBodyScroll();
      this._setupOptionalFocusTrap();
    }
  }

  /**
   * Enables strict focus trapping when the focus-trap attribute is present.
   * Enforces stricter boundaries than native focus trapping, preventing programmatic escape.
   */
  private _setupOptionalFocusTrap(): void {
    if (this.hasAttribute('focus-trap')) {
      this._cleanupFocusTrap = createFocusTrap(this, true);
    }
  }

  private _lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private _unlockBodyScroll(): void {
    document.body.style.overflow = '';
  }

  disconnectedCallback(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];

    if (this._cleanupFocusTrap) {
      this._cleanupFocusTrap();
      this._cleanupFocusTrap = null;
    }

    this.close();
  }
}
