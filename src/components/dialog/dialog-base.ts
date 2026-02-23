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
  private _isMounted = false;
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
    if (this._isMounted) return;
    this._isMounted = true;

    this._setupCloseButtons();
    this._setupExternalTriggers();

    this.addEventListener('close', this._onClose);
    this._addCleanup(() => this.removeEventListener('close', this._onClose));

    this.addEventListener('click', this._onBackdropClick);
    this._addCleanup(() =>
      this.removeEventListener('click', this._onBackdropClick)
    );
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();

    if (this._cleanupFocusTrap) {
      this._cleanupFocusTrap();
      this._cleanupFocusTrap = null;
    }

    this.close();
  }

  show(): void {
    if (!this.open) {
      this.showModal();
      this._lockBodyScroll();
      this._setupOptionalFocusTrap();
    }
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
      this._addCleanup(() => {
        button.removeEventListener('click', onClick);
      });
    });
  }

  /**
   * Binds event listeners to external trigger elements.
   * Enables declarative control via aria-controls without requiring JavaScript.
   */
  private _setupExternalTriggers(): void {
    this._addCleanup(setupExternalTriggers(this.id, () => this.show()));
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

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}
