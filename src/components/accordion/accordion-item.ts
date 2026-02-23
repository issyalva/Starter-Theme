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
  private _isMounted = false;
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

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

    const onToggleOpen = (): void => {
      if (iconClosed) iconClosed.style.display = 'none';
      if (iconOpen) iconOpen.style.display = '';
    };

    const onToggleClose = (): void => {
      if (iconClosed) iconClosed.style.display = '';
      if (iconOpen) iconOpen.style.display = 'none';
    };

    this.addEventListener('toggle:open', onToggleOpen);
    this._addCleanup(() =>
      this.removeEventListener('toggle:open', onToggleOpen)
    );

    this.addEventListener('toggle:close', onToggleClose);
    this._addCleanup(() =>
      this.removeEventListener('toggle:close', onToggleClose)
    );

    const disclosure = this.querySelector('ui-disclosure');
    if (disclosure && disclosure.hasAttribute('open')) {
      onToggleOpen();
    } else {
      onToggleClose();
    }
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}

customElements.define('ui-accordion-item', AccordionItem);
