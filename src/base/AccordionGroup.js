/**
 * An accordion group component that manages multiple AccordionItem children.
 * Supports single mode where only one item can be open at a time.
 *
 * @class AccordionGroup
 * @extends {HTMLElement}
 *
 * @example
 * // Standard accordion group (multiple items can be open)
 * <ui-accordion-group>
 *   <ui-accordion-item id="faq-1">
 *     <button aria-controls="faq-1">Question 1</button>
 *     <div>Answer 1</div>
 *   </ui-accordion-item>
 *   <ui-accordion-item id="faq-2">
 *     <button aria-controls="faq-2">Question 2</button>
 *     <div>Answer 2</div>
 *   </ui-accordion-item>
 * </ui-accordion-group>
 *
 * @example
 * // Single mode (only one item open at a time)
 * <ui-accordion-group single>
 *   <ui-accordion-item id="faq-1">...</ui-accordion-item>
 *   <ui-accordion-item id="faq-2">...</ui-accordion-item>
 * </ui-accordion-group>
 */
export class AccordionGroup extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('single')) {
      this._handleToggleOpen = (e) => {
        // Close all other toggles in this group
        const allToggles = this.querySelectorAll('ui-toggle');
        allToggles.forEach((toggle) => {
          if (toggle !== e.target && toggle.hasAttribute('open')) {
            toggle.hide();
          }
        });
      };

      this.addEventListener('toggle:open', this._handleToggleOpen);
    }
  }

  disconnectedCallback() {
    if (this._handleToggleOpen) {
      this.removeEventListener('toggle:open', this._handleToggleOpen);
    }
  }
}

customElements.define('ui-accordion-group', AccordionGroup);
