import { createFocusTrap } from '../utilities/focusTrap';

export class ToggleContainer extends HTMLElement {
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

    if (this._focusTrapCleanup) {
      this._focusTrapCleanup();
    }
  }

  _bindTriggers() {
    if (!this.id) return;

    // External triggers that toggle
    const externalTriggers = document.querySelectorAll(`[aria-controls="${this.id}"]`);
    this._setupTriggers(externalTriggers, () => this.toggle());

    // Internal triggers that close
    const internalTriggers = this.querySelectorAll('[data-trigger]');
    this._setupTriggers(internalTriggers, () => this.hide());
  }

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
      
      // Store cleanup info
      if (!this._cleanupFns) this._cleanupFns = [];
      this._cleanupFns.push(() => {
        trigger.removeEventListener('click', handleClick);
        trigger.removeEventListener('keydown', handleKeydown);
      });
    });
  }

  _unbindTriggers() {
    if (this._cleanupFns) {
      this._cleanupFns.forEach(fn => fn());
      this._cleanupFns = [];
    }
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
    this._focusTrapCleanup = createFocusTrap(this);
  }

  onClose() {
    if (this._focusTrapCleanup) {
      this._focusTrapCleanup();
      this._focusTrapCleanup = null;
    }
  }
}

customElements.define('ui-toggle', ToggleContainer);
