import { createFocusTrap } from '../utilities/focusTrap';

export class BaseToggleElement extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  constructor() {
    super();
    this._trigger = null;
    this._container = null;
    this._focusTrap = null;
    console.log('banana')
  }

  connectedCallback() {
        console.log('banana!!')
    this._trigger = this.querySelector("[data-trigger]");
    this._container = this.querySelector("[data-container]");

    if (this._container) {
      this._focusTrap = createFocusTrap(this._container);
    }

    // Set initial state
    this._upgradeProperty("open");
    this._applyState();
    
    // Attach trigger listener
    if (this._trigger) {
      this._trigger.addEventListener("click", () => this.toggle());
    }
  }

  // Ensures that if a property was set before upgrade, 
  // it syncs with the attribute
  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  // ATTRIBUTES ----------------------------------------------------

  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "open") {
      this._applyState();
    }
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(value) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  // PUBLIC API ----------------------------------------------------

  toggle() {
    this.open = !this.open;
    console.log('toggled');
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  // STATE UPDATES -------------------------------------------------

  _applyState() {
    const isOpen = this.open;

    // Update A11Y
    if (this._trigger) {
      this._trigger.setAttribute("aria-expanded", isOpen);
    }
    if (this._container) {
      this._container.setAttribute("aria-hidden", !isOpen);
      this._container.classList.toggle("is-open", isOpen);
    }

    // Lifecycle hooks for extended components
    if (isOpen) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  // EXTENSION HOOKS -----------------------------------------------

  onOpen() {
    // Child components override this
    if (this._focusTrap) {
      this._focusTrap.activate();
    }
  }

  onClose() {
    // Child components override this
    if (this._focusTrap) {
      this._focusTrap.deactivate();
    }
  }
}

customElements.define("ui-toggle", BaseToggleElement);
