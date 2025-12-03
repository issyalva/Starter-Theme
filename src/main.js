// Main entry point for theme JavaScript
// Uses code splitting to load only components that exist on the page

const componentMap = {
  'ui-disclosure': () => import('./components/disclosure/disclosure.js'),
  'ui-accordion-group, ui-accordion-item': () =>
    Promise.all([
      import('./components/accordion/accordion-group.js'),
      import('./components/accordion/accordion-item.js'),
    ]),
  'dialog[is="ui-drawer"]': () => import('./components/dialog/drawer.js'),
  'dialog[is="ui-modal"]': () => import('./components/dialog/modal.js'),
};

// Load components that exist on the page
function loadComponents() {
  const promises = Object.entries(componentMap)
    .filter(([selector]) => document.querySelector(selector))
    .map(([, loader]) => loader());

  return Promise.all(promises);
}

// Load when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
