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
  private _cleanupFns: (() => void)[] = [];

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

    const showOpen = (): void => {
      if (iconClosed) iconClosed.style.display = 'none';
      if (iconOpen) iconOpen.style.display = '';
    };

    const showClosed = (): void => {
      if (iconClosed) iconClosed.style.display = '';
      if (iconOpen) iconOpen.style.display = 'none';
    };

    this.addEventListener('toggle:open', showOpen);
    this._cleanupFns.push(() => this.removeEventListener('toggle:open', showOpen));

    this.addEventListener('toggle:close', showClosed);
    this._cleanupFns.push(() =>
      this.removeEventListener('toggle:close', showClosed)
    );

    const disclosure = this.querySelector('ui-disclosure');
    if (disclosure && disclosure.hasAttribute('open')) {
      showOpen();
    } else {
      showClosed();
    }
  }

  disconnectedCallback(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}

customElements.define('ui-accordion-item', AccordionItem);
