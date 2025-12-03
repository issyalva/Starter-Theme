/**
 * Returns a list of focusable elements within the given element
 * @param {HTMLElement} element - The container element to search within
 * @returns {NodeList} List of focusable elements
 */
const getFocusableElements = (element) => {
  return element.querySelectorAll(`
    a[href]:not([disabled]),
    button:not([disabled]),
    input:not([disabled]),
    select:not([disabled]),
    textarea:not([disabled]),
    [tabindex]:not([tabindex="-1"]),
    div[role="button"],
    a[role="button"]
  `);
};

/**
 * Sets up a focus trap for specified element
 *
 * @param {HTMLElement} element - The element to trap focus within
 * @param {boolean} [preventFirstVisibleOutline=false] - Prevents the first focusable element from having a visible outline on initial execution
 * @returns {Function} Cleanup function that removes the focus trap and restores focus to trigger
 */
export function createFocusTrap(element, preventFirstVisibleOutline = false) {
  const focusableElements = getFocusableElements(element);
  if (!focusableElements.length) return () => {};

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  // Store the element that had focus before the trap was created
  const triggerElement = document.activeElement;

  if (!element.contains(document.activeElement)) {
    firstFocusableElement.focus();
    if (preventFirstVisibleOutline)
      firstFocusableElement.style.outlineWidth = '0';
  }

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    if (preventFirstVisibleOutline)
      firstFocusableElement.style.outlineWidth = 'initial';

    const shouldPreventDefault =
      (e.shiftKey && document.activeElement === firstFocusableElement) ||
      (!e.shiftKey && document.activeElement === lastFocusableElement);

    if (shouldPreventDefault) {
      e.preventDefault();
      e.shiftKey ? lastFocusableElement.focus() : firstFocusableElement.focus();
    }
  };

  element.addEventListener('keydown', handleTabKey);

  return () => {
    element.removeEventListener('keydown', handleTabKey);

    // Return focus to trigger element
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
  };
}
