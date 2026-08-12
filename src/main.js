// Main entry point for theme JavaScript
// Uses code splitting to load only components that exist on the page

const componentMap = {
  'ui-disclosure': () => import('./components/disclosure/disclosure'),
  'ui-accordion-group': () => import('./components/accordion/accordion-group'),
  'ui-accordion-item': () => import('./components/accordion/accordion-item'),
  'ui-select': () => import('./components/forms/select-dropdown'),
  'dialog[is="ui-drawer"]': () => import('./components/dialog/drawer'),
  'dialog[is="ui-modal"]': () => import('./components/dialog/modal'),
  'ui-tabs-group': () => import('./components/tabs/tabs-group'),
  'dropdown-menu': () => import('./components/menu/dropdown-menu'),
  'mega-menu': () => import('./components/menu/mega-menu'),
  'ui-quantity-selector': () => import('./components/form/quantity-selector'),
};

// Load components that exist on the page
function loadComponents() {
  const promises = Object.entries(componentMap)
    .filter(([selector]) => document.querySelector(selector))
    .map(([, loader]) => loader());

  return Promise.all(promises).catch((error) => {
    console.error('Failed to load components:', error);
  });
}

// Load when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadComponents().catch((error) => {
      console.error('Component initialization failed:', error);
    });
  });
} else {
  loadComponents().catch((error) => {
    console.error('Component initialization failed:', error);
  });
}
