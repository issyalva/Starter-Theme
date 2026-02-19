const getFocusableElements = (element: HTMLElement): NodeListOf<Element> => {
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
 * Creates a focus trap that keeps Tab/Shift+Tab navigation within element boundaries.
 * Returns focus to the original trigger element on cleanup.
 */
export function createFocusTrap(
  element: HTMLElement,
  preventFirstVisibleOutline: boolean = false
): () => void {
  const focusableElements = getFocusableElements(element);
  if (!focusableElements.length) return () => {};

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  const triggerElement = document.activeElement as HTMLElement | null;

  if (!element.contains(document.activeElement)) {
    firstFocusableElement.focus();
    if (preventFirstVisibleOutline)
      firstFocusableElement.style.outlineWidth = '0';
  }

  const handleTabKey = (e: KeyboardEvent): void => {
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
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
  };
}
