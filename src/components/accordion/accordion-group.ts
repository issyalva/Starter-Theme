import { Disclosure } from '../disclosure/disclosure.js';

/**
 * Manages multiple AccordionItem children with single or multiple open modes.
 * Single mode (default) ensures only one item is open at a time for focused content.
 *
 * @example
 * <ui-accordion-group aria-label="Frequently Asked Questions">
 *   <ui-accordion-item>
 *     <button aria-controls="faq-1">Question 1</button>
 *     <ui-disclosure id="faq-1">
 *       <div>Answer 1</div>
 *     </ui-disclosure>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 *
 * @example
 * <ui-accordion-group multiple aria-label="Product Features">
 *   <ui-accordion-item>
 *     <button aria-controls="faq-1">Question 1</button>
 *     <ui-disclosure id="faq-1">
 *       <div>Answer 1</div>
 *     </ui-disclosure>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 */
export class AccordionGroup extends HTMLElement {
  private _isMounted = false;
  private _disclosures: Disclosure[] = [];
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

    this.setAttribute('role', 'region');

    if (
      !this.hasAttribute('aria-label') &&
      !this.hasAttribute('aria-labelledby')
    ) {
      this.setAttribute('aria-label', 'Accordion group');
    }

    if (!this.hasAttribute('multiple')) {
      this._disclosures = Array.from(this.querySelectorAll('ui-disclosure'));

      const onToggleOpen = (e: Event): void => {
        const targetDisclosure = e.target instanceof Disclosure ? e.target : null;

        this._disclosures.forEach((disclosure) => {
          if (disclosure !== targetDisclosure && disclosure.hasAttribute('open')) {
            disclosure.hide();
          }
        });
      };

      this.addEventListener('toggle:open', onToggleOpen);
      this._addCleanup(() =>
        this.removeEventListener('toggle:open', onToggleOpen)
      );

      const openDisclosures = this._disclosures.filter((disclosure) =>
        disclosure.hasAttribute('open')
      );

      if (openDisclosures.length > 1) {
        openDisclosures.slice(1).forEach((disclosure) => disclosure.hide());
      }
    }
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._disclosures = [];
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}

if (!customElements.get('ui-accordion-group')) {
  customElements.define('ui-accordion-group', AccordionGroup);
}
