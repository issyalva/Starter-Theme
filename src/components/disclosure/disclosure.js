import {
  setupExternalTriggers,
  updateTriggerAria,
} from '../../utilities/trigger-manager.js';

/**
 * A custom element that provides toggle/show/hide functionality.
 * Can be controlled by external triggers using aria-controls or internal triggers with data-close.
 *
 * @class Disclosure
 * @extends {HTMLElement}
 *
 * @example
 * <button aria-controls="my-drawer">Open Drawer</button>
 * <ui-disclosure id="my-drawer">
 *   <div>
 *     <button data-close>Close</button>
 *     <p>Drawer content</p>
 *   </div>
 * </ui-disclosure>
 */

export class Disclosure extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this._cleanupFns = [];
    this._cleanupExternalTriggers = null;
    this._cachedTriggers = null;
  }

  connectedCallback() {
    this._bindTriggers();
    this._applyState();
  }

  disconnectedCallback() {
    this._unbindTriggers();
    if (this._cleanupExternalTriggers) {
      this._cleanupExternalTriggers();
    }
  }

  /**
   * Binds event listeners to external and internal triggers.
   * External triggers (with aria-controls) toggle the element.
   * Internal triggers (with data-close) close the element.
   * @private
   */
  _bindTriggers() {
    // External triggers that toggle (cached)
    this._cleanupExternalTriggers = setupExternalTriggers(this.id, () =>
      this.toggle()
    );

    // Internal triggers that close
    const internalTriggers = this.querySelectorAll('[data-close]');
    this._setupTriggers(internalTriggers, () => this.hide());
  }

  /**
   * Sets up click and keyboard event listeners for triggers.
   * @private
   * @param {NodeList} triggers - The trigger elements to set up
   * @param {Function} action - The action to perform when triggered
   */
  _setupTriggers(triggers, action) {
    const handleClick = () => action();
    const handleKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', handleClick);
      trigger.addEventListener('keydown', handleKeydown);

      this._cleanupFns.push(() => {
        trigger.removeEventListener('click', handleClick);
        trigger.removeEventListener('keydown', handleKeydown);
      });
    });
  }

  /**
   * Removes all trigger event listeners.
   * @private
   */
  _unbindTriggers() {
    if (this._cleanupFns) {
      this._cleanupFns.forEach((fn) => fn());
      this._cleanupFns = [];
    }
  }

  /**
   * Called when an observed attribute changes.
   * @param {string} name - The name of the attribute that changed
   */
  attributeChangedCallback(name) {
    if (name === 'open') {
      this._applyState();
    }
  }

  /**
   * Gets the open state of the element.
   * @returns {boolean} True if the element has the 'open' attribute
   */
  get open() {
    return this.hasAttribute('open');
  }

  /**
   * Sets the open state of the element.
   * @param {boolean} value - Whether the element should be open
   */
  set open(value) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  // PUBLIC API
  /**
   * Toggles the open state of the element.
   */
  toggle() {
    this.open = !this.open;
  }

  /**
   * Opens the element.
   */
  show() {
    this.open = true;
  }

  /**
   * Closes the element.
   */
  hide() {
    this.open = false;
  }

  // STATE UPDATES
  /**
   * Applies the current open/closed state to the element.
   * Updates inert attribute and calls lifecycle hooks.
   * @private
   */
  _applyState() {
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
   * Uses cached triggers to avoid re-querying DOM on every state change.
   * @private
   */
  _updateTriggerAria() {
    // Cache triggers on first call, reuse on subsequent calls
    this._cachedTriggers = updateTriggerAria(
      this.id,
      this.open,
      this._cachedTriggers
    );
  }

  // EXTENSION HOOKS
  /**
   * Lifecycle hook called when the element opens.
   * Can be overridden in subclasses.
   */
  onOpen() {
    this.dispatchEvent(new CustomEvent('toggle:open', { bubbles: true }));
  }

  /**
   * Lifecycle hook called when the element closes.
   * Can be overridden in subclasses.
   */
  onClose() {
    this.dispatchEvent(new CustomEvent('toggle:close', { bubbles: true }));
  }
}

customElements.define('ui-disclosure', Disclosure);
