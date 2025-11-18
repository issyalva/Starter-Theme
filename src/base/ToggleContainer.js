import { createFocusTrap } from '../utilities/focusTrap';

export class ToggleContainer extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this._focusTrapCleanup = null;
    this._triggers = [];
    this._handleEscape = null;
    this._handleTriggerClick = null;
    this._handleTriggerKeydown = null;
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

    if (this._focusTrapCleanup) {
      this._focusTrapCleanup();
    }
  }

  _bindTriggers() {
    if (!this.id) return;

    this._triggers = Array.from(
      document.querySelectorAll(`[aria-controls="${this.id}"]`)
    );

    this._handleTriggerClick = () => this.toggle();

    this._handleTriggerKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    };

    this._triggers.forEach((trigger) => {
      trigger.addEventListener('click', this._handleTriggerClick);
      trigger.addEventListener('keydown', this._handleTriggerKeydown);
    });
  }

  _unbindTriggers() {
    if (!this._handleTriggerClick || !this._handleTriggerKeydown) return;

    this._triggers.forEach((trigger) => {
      trigger.removeEventListener('click', this._handleTriggerClick);
      trigger.removeEventListener('keydown', this._handleTriggerKeydown);
    });

    this._triggers = [];
  }

  attributeChangedCallback(name) {
    if (name === 'open') {
      this._applyState();
    }
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  // PUBLIC API
  toggle() {
    this.open = !this.open;
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  // STATE UPDATES
  _applyState() {
    const isOpen = this.open;
    this.setAttribute('aria-hidden', !isOpen);
    this._updateTriggerAria();

    // Lifecycle hooks
    if (isOpen) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

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
  onOpen() {
    if (this) {
      this._focusTrapCleanup = createFocusTrap(this);
    }
  }

  onClose() {
    if (this._focusTrapCleanup) {
      this._focusTrapCleanup();
      this._focusTrapCleanup = null;
    }
  }
}

customElements.define('ui-toggle', ToggleContainer);
