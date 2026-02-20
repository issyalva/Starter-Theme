import type { AccordionGroup } from '../components/accordion/accordion-group.js';
import type { AccordionItem } from '../components/accordion/accordion-item.js';
import type { Disclosure } from '../components/disclosure/disclosure.js';

declare global {
  interface HTMLElementTagNameMap {
    'ui-accordion-group': AccordionGroup;
    'ui-accordion-item': AccordionItem;
    'ui-disclosure': Disclosure;
  }
}

export {};