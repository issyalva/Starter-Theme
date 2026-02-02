import {
  setupExternalTriggers,
  updateTriggerAria,
} from '../../utilities/trigger-manager.js';

/**
 * A custom element that provides toggle/show/hide functionality.
 * Can be controlled by external triggers using aria-controls or internal triggers with data-close.
 *
 * @example
 * <button aria-controls="filters-panel">Show filters</button>
 * <ui-disclosure id="filters-panel">
 *   <div>
 *     <h3>Filter options</h3>
 *     <button data-close>Close</button>
 *     <!-- Filter content here -->
 *   </div>
 * </ui-disclosure>
 *
 * @note External triggers (aria-controls) are cached for performance. If triggers are
 * dynamically added/removed after initial render, call refreshTriggers() to update the cache.
 */
export class Disclosure extends HTMLElement {
  private _cleanupFns: (() => void)[] = [];
  private _cleanupExternalTriggers: (() => void) | null = null;
  private _cachedTriggers: Element[] | null = null;

  static get observedAttributes(): string[] {
    return ['open'];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    this._bindTriggers();
    this._applyState();
  }

  disconnectedCallback(): void {
    this._unbindTriggers();
    if (this._cleanupExternalTriggers) {
      this._cleanupExternalTriggers();
    }
  }

  /**
   * Binds event listeners to external and internal triggers.
   * External triggers (aria-controls) allow other elements to control this disclosure,

   * Internal triggers (data-close) provide a way to close from within the disclosure content
   */
  private _bindTriggers(): void {
    this._cleanupExternalTriggers = setupExternalTriggers(this.id, () =>
      this.toggle()
    );

    const internalTriggers = this.querySelectorAll('[data-close]');
    this._setupTriggers(internalTriggers, () => this.hide());
  }

  private _setupTriggers(triggers: NodeListOf<Element>, callback: () => void): void {
    const handleClick = (): void => callback();
    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', handleClick);
      trigger.addEventListener('keydown', handleKeydown as EventListener);

      this._cleanupFns.push(() => {
        trigger.removeEventListener('click', handleClick);
        trigger.removeEventListener('keydown', handleKeydown as EventListener);
      });
    });
  }

  private _unbindTriggers(): void {
    this._cleanupFns.forEach((fn) => fn());
    this._cleanupFns = [];
  }

  attributeChangedCallback(): void {
    this._applyState();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  toggle(): void {
    this.open = !this.open;
  }

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }

  /**
   * Applies the current open/closed state to the element.
   * Manages accessibility (inert attribute), trigger states (aria-expanded),
   * and fires lifecycle hooks to notify other components of state changes.
   */
  private _applyState(): void {
    // Use inert to remove from tab order and accessibility tree when closed
    if (this.open) {
      this.removeAttribute('inert');
    } else {
      this.setAttribute('inert', '');
    }

    this._updateTriggerAria();

    if (this.open) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  /**
   * Updates aria-expanded attribute on all triggers that control this element.
   * This keeps trigger buttons in sync with the disclosure state for accessibility.
   * Uses cached triggers to avoid re-querying DOM on every state change.
   */
  private _updateTriggerAria(): void {
    this._cachedTriggers = updateTriggerAria(
      this.id,
      this.open,
      this._cachedTriggers
    );
  }

  /**
   * Invalidates the cached triggers and forces a fresh DOM query.
   * Useful when triggers are dynamically added or removed from the DOM.
   *
   * @example
   * // After dynamically adding new triggers
   * disclosure.refreshTriggers();
   */
  refreshTriggers(): void {
    this._cachedTriggers = null;
    this._updateTriggerAria();
  }

  /**
   * Lifecycle hook called when the element opens.
   * Dispatches a 'toggle:open' custom event that bubbles, allowing parent components
   * to coordinate behavior (e.g., accordion-group closing other items) and child
   * components to update visual state (e.g., accordion-item toggling icons).
   * Can be overridden in subclasses to add custom open behavior.
   */
  onOpen(): void {
    this.dispatchEvent(new CustomEvent('toggle:open', { bubbles: true }));
  }

  /**
   * Lifecycle hook called when the element closes.
   * Dispatches a 'toggle:close' custom event that bubbles, allowing parent components
   * to coordinate behavior and child components to update visual state.
   * Can be overridden in subclasses to add custom close behavior.
   */
  onClose(): void {
    this.dispatchEvent(new CustomEvent('toggle:close', { bubbles: true }));
  }
}

customElements.define('ui-disclosure', Disclosure);
