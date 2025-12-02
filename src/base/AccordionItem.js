/**
 * An accordion item component - a simple wrapper for semantic grouping.
 * Supports slotted icons for open/close states.
 *
 * @class AccordionItem
 * @extends {HTMLElement}
 *
 * @example
 * <ui-accordion-item>
 *   <button aria-controls="faq-1">
 *     Question
 *     <span slot="icon-closed">+</span>
 *     <span slot="icon-open">−</span>
 *   </button>
 *   <ui-toggle id="faq-1">
 *     <p>We accept returns within 30 days...</p>
 *   </ui-toggle>
 * </ui-accordion-item>
 *
 * @example
 * // With SVG icons
 * <ui-accordion-item>
 *   <button aria-controls="faq-2">
 *     Question
 *     <svg slot="icon-closed">...</svg>
 *     <svg slot="icon-open">...</svg>
 *   </button>
 *   <ui-toggle id="faq-2">Answer</ui-toggle>
 * </ui-accordion-item>
 */
export class AccordionItem extends HTMLElement {
  connectedCallback() {
    this._setupIconToggle();
  }

  /**
   * Sets up icon visibility based on toggle state.
   * @private
   */
  _setupIconToggle() {
    const iconClosed = this.querySelector('[slot="icon-closed"]');
    const iconOpen = this.querySelector('[slot="icon-open"]');

    if (!iconClosed && !iconOpen) return;

    // Store handlers for cleanup
    this._showOpen = () => {
      if (iconClosed) iconClosed.style.display = 'none';
      if (iconOpen) iconOpen.style.display = '';
    };

    this._showClosed = () => {
      if (iconClosed) iconClosed.style.display = '';
      if (iconOpen) iconOpen.style.display = 'none';
    };

    // Listen for toggle events
    this.addEventListener('toggle:open', this._showOpen);
    this.addEventListener('toggle:close', this._showClosed);

    // Set initial state
    const toggle = this.querySelector('ui-toggle');
    if (toggle && toggle.hasAttribute('open')) {
      this._showOpen();
    } else {
      this._showClosed();
    }
  }

  disconnectedCallback() {
    if (this._showOpen) {
      this.removeEventListener('toggle:open', this._showOpen);
    }
    if (this._showClosed) {
      this.removeEventListener('toggle:close', this._showClosed);
    }
  }
}

customElements.define('ui-accordion-item', AccordionItem);
