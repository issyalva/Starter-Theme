/**
 * A wrapper component for semantic grouping of accordion content.
 * Toggles slotted icon visibility based on disclosure state for visual feedback.
 *
 * @example
 * <ui-accordion-item>
 *   <button aria-controls="faq-1">
 *     Question
 *     <span slot="icon-closed">+</span>
 *     <span slot="icon-open">−</span>
 *   </button>
 *   <ui-disclosure id="faq-1">
 *     <p>Answer content</p>
 *   </ui-disclosure>
 * </ui-accordion-item>
 */
export class AccordionItem extends HTMLElement {
  private _showOpen?: () => void;
  private _showClosed?: () => void;

  connectedCallback(): void {
    this._setupIconToggle();
  }

  /**
   * Toggles icon visibility based on disclosure state.
   * Listens to bubbling toggle events from child disclosure elements.
   */
  private _setupIconToggle(): void {
    const iconClosed = this.querySelector('[slot="icon-closed"]') as HTMLElement | null;
    const iconOpen = this.querySelector('[slot="icon-open"]') as HTMLElement | null;

    if (!iconClosed && !iconOpen) return;

    this._showOpen = (): void => {
      if (iconClosed) iconClosed.style.display = 'none';
      if (iconOpen) iconOpen.style.display = '';
    };

    this._showClosed = (): void => {
      if (iconClosed) iconClosed.style.display = '';
      if (iconOpen) iconOpen.style.display = 'none';
    };

    this.addEventListener('toggle:open', this._showOpen);
    this.addEventListener('toggle:close', this._showClosed);

    const disclosure = this.querySelector('ui-disclosure');
    if (disclosure && disclosure.hasAttribute('open')) {
      this._showOpen();
    } else {
      this._showClosed();
    }
  }

  disconnectedCallback(): void {
    if (this._showOpen) {
      this.removeEventListener('toggle:open', this._showOpen);
    }
    if (this._showClosed) {
      this.removeEventListener('toggle:close', this._showClosed);
    }
  }
}

customElements.define('ui-accordion-item', AccordionItem);
