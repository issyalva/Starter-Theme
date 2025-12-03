/**
 * An accordion group component that manages multiple AccordionItem children.
 * By default, only one item can be open at a time (single mode).
 * Add the 'multiple' attribute to allow multiple items to be open simultaneously.
 *
 * Automatically adds role="region" and aria-label for accessibility.
 * You can provide a custom label via aria-label or aria-labelledby.
 *
 * @class AccordionGroup
 * @extends {HTMLElement}
 *
 * @example
 * // Default: single mode with default label
 * <ui-accordion-group>
 *   <ui-accordion-item>
 *     <button aria-controls="faq-1">Question 1</button>
 *     <ui-toggle id="faq-1">
 *       <div>Answer 1</div>
 *     </ui-toggle>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 *
 * @example
 * // With custom accessible label
 * <ui-accordion-group aria-label="Frequently Asked Questions">
 *   <ui-accordion-item>
 *     <button aria-controls="faq-1">Question 1</button>
 *     <ui-toggle id="faq-1">
 *       <div>Answer 1</div>
 *     </ui-toggle>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 *
 * @example
 * // Multiple mode (multiple items can be open)
 * <ui-accordion-group multiple aria-label="Product Features">
 *   <ui-accordion-item>
 *     <button aria-controls="faq-1">Question 1</button>
 *     <ui-toggle id="faq-1">
 *       <div>Answer 1</div>
 *     </ui-toggle>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 */
export class AccordionGroup extends HTMLElement {
  connectedCallback() {
    // Set ARIA role for the accordion group
    this.setAttribute('role', 'region');

    // Provide accessible label if aria-label or aria-labelledby is not present
    if (
      !this.hasAttribute('aria-label') &&
      !this.hasAttribute('aria-labelledby')
    ) {
      this.setAttribute('aria-label', 'Accordion group');
    }

    // Single mode is the default (unless 'multiple' attribute is present)
    if (!this.hasAttribute('multiple')) {
      this._handleToggleOpen = (e) => {
        // Close all other toggles in this group
        this.querySelectorAll('ui-toggle').forEach((toggle) => {
          if (toggle !== e.target && toggle.hasAttribute('open')) {
            toggle.hide();
          }
        });
      };

      this.addEventListener('toggle:open', this._handleToggleOpen);

      // Enforce single mode on initialization - close all but the first open item
      const openToggles = Array.from(this.querySelectorAll('ui-toggle')).filter(
        (toggle) => toggle.hasAttribute('open')
      );

      if (openToggles.length > 1) {
        openToggles.slice(1).forEach((toggle) => toggle.hide());
      }
    }
  }

  disconnectedCallback() {
    if (this._handleToggleOpen) {
      this.removeEventListener('toggle:open', this._handleToggleOpen);
    }
  }
}

customElements.define('ui-accordion-group', AccordionGroup);
