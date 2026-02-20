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
  private _disclosures: Disclosure[] = [];
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    this.setAttribute('role', 'region');

    if (
      !this.hasAttribute('aria-label') &&
      !this.hasAttribute('aria-labelledby')
    ) {
      this.setAttribute('aria-label', 'Accordion group');
    }

    if (!this.hasAttribute('multiple')) {
      this._disclosures = Array.from(this.querySelectorAll('ui-disclosure'));

      const handleToggleOpen = (e: Event): void => {
        const targetDisclosure = e.target instanceof Disclosure ? e.target : null;

        this._disclosures.forEach((disclosure) => {
          if (disclosure !== targetDisclosure && disclosure.hasAttribute('open')) {
            disclosure.hide();
          }
        });
      };

      this.addEventListener('toggle:open', handleToggleOpen);
      this._cleanupFns.push(() =>
        this.removeEventListener('toggle:open', handleToggleOpen)
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
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
    this._disclosures = [];
  }
}

customElements.define('ui-accordion-group', AccordionGroup);
