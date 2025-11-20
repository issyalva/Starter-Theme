import { createFocusTrap } from '../utilities/focusTrap';

/**
 * A custom element that provides toggle/show/hide functionality with focus trap support.
 * Can be controlled by external triggers using aria-controls or internal triggers with data-trigger.
 *
 * @class ToggleElement
 * @extends {HTMLElement}
 *
 * @example
 * <button aria-controls="my-drawer">Open Drawer</button>
 * <ui-toggle id="my-drawer">
 *   <div>
 *     <button data-trigger>Close</button>
 *     <p>Drawer content</p>
 *   </div>
 * </ui-toggle>
 */

export class ToggleElement extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this._focusTrapCleanup = null;
    this._cleanupFns = [];
    this._handleEscape = null;
  }

  connectedCallback() {
    this._bindTriggers();
    this._applyState();

    this._handleEscape = (e) => {
      if (e.key === 'Escape' && this.open) {
        this.hide();
      }
    };
    document.addEventListener('keydown', this._handleEscape);
  }

  disconnectedCallback() {
    this._unbindTriggers();

    if (this._handleEscape) {
      document.removeEventListener('keydown', this._handleEscape);
    }

    this._cleanupFocusTrap();
  }

  /**
   * Cleans up the focus trap if it exists.
   * @private
   */
  _cleanupFocusTrap() {
    if (this._focusTrapCleanup) {
      this._focusTrapCleanup();
      this._focusTrapCleanup = null;
    }
  }

  /**
   * Binds event listeners to external and internal triggers.
   * External triggers (with aria-controls) toggle the element.
   * Internal triggers (with data-trigger) close the element.
   * @private
   */
  _bindTriggers() {
    if (!this.id) return;

    // External triggers that toggle
    const externalTriggers = document.querySelectorAll(`[aria-controls="${this.id}"]`);
    this._setupTriggers(externalTriggers, () => this.toggle());

    // Internal triggers that close
    const internalTriggers = this.querySelectorAll('[data-trigger]');
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
      this._cleanupFns.forEach(fn => fn());
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
   * Updates aria attributes and calls lifecycle hooks.
   * @private
   */
  _applyState() {
    console.log('Applying state:', this.open);
    this.setAttribute('aria-hidden', !this.open);
    
    // Use inert to remove from tab order when closed
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
   * @private
   */
  _updateTriggerAria() {
    const triggerId = this.id;
    if (!triggerId) return;

    const triggers = document.querySelectorAll(
      `[aria-controls="${triggerId}"]`
    );
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', this.open);
    });
  }

  // EXTENSION HOOKS
  /**
   * Lifecycle hook called when the element opens.
   * Sets up focus trap by default. Can be overridden in subclasses.
   */
  onOpen() {
    this._focusTrapCleanup = createFocusTrap(this);
  }

  /**
   * Lifecycle hook called when the element closes.
   * Cleans up focus trap by default. Can be overridden in subclasses.
   */
  onClose() {
    this._cleanupFocusTrap();
  }
}

customElements.define('ui-toggle', ToggleElement);
