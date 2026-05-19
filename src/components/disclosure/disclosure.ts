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
  private _isMounted = false;
  private _cleanupFns: (() => void)[] = [];
  protected _cachedTriggers: Element[] | null = null;

  static get observedAttributes(): string[] {
    return ['open'];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

    this._bindTriggers();
    this._applyState();
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._cachedTriggers = null;
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
   * Invalidates the cached triggers and forces a fresh DOM query.
   * Use when triggers are dynamically added or removed from the DOM.
   */
  refreshTriggers(): void {
    this._cachedTriggers = null;
    this._updateTriggerAria();
  }

  /**
   * Lifecycle hook called when the element opens.
   * Dispatches bubbling event for parent coordination (e.g., accordion exclusivity) and child state updates.
   */
  onOpen(): void {
    this.dispatchEvent(
      new CustomEvent('toggle:open', { bubbles: true, composed: true })
    );
  }

  /**
   * Lifecycle hook called when the element closes.
   * Dispatches bubbling event for parent coordination and child state updates.
   */
  onClose(): void {
    this.dispatchEvent(
      new CustomEvent('toggle:close', { bubbles: true, composed: true })
    );
  }

  /**
   * Binds event listeners to external and internal triggers.
   * External triggers enable declarative control, internal triggers provide close functionality.
   */
  private _bindTriggers(): void {
    this._addCleanup(setupExternalTriggers(this.id, () => this.toggle()));

    const internalTriggers = this.querySelectorAll('[data-close]');
    this._setupTriggers(internalTriggers, () => this.hide());
  }

  private _setupTriggers(
    triggers: NodeListOf<Element>,
    callback: () => void
  ): void {
    const onClick = (): void => callback();
    const onKeydown = (e: Event): void => {
      if (!(e instanceof KeyboardEvent)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', onClick);
      trigger.addEventListener('keydown', onKeydown);

      this._addCleanup(() => {
        trigger.removeEventListener('click', onClick);
        trigger.removeEventListener('keydown', onKeydown);
      });
    });
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((fn) => fn());
    this._cleanupFns = [];
  }

  /**
   * Applies the current open/closed state to the element.
   * Manages accessibility attributes, syncs trigger states, and fires lifecycle hooks for child/parent components.
   */
  private _applyState(): void {
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
   * Updates aria-expanded on all triggers that control this element.
   * Uses cached triggers to avoid re-querying DOM on every state change.
   */
  private _updateTriggerAria(): void {
    this._cachedTriggers = updateTriggerAria(
      this.id,
      this.open,
      this._cachedTriggers
    );
  }
}

if (!customElements.get('ui-disclosure')) {
  customElements.define('ui-disclosure', Disclosure);
}
