/**
 * Returns a list of focusable elements within the given element.
 */
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
 * Sets up a focus trap for the specified element.
 * 
 * Automatically focuses the first focusable element and traps Tab/Shift+Tab navigation
 * within the element boundaries. Returns focus to the original trigger element on cleanup.
 * 
 * @param [preventFirstVisibleOutline=false] - Optional. Prevents the first focusable element from having a visible outline on initial focus
 * @returns Cleanup function that removes the focus trap and restores focus to trigger
 */
export function createFocusTrap(
  element: HTMLElement,
  preventFirstVisibleOutline: boolean = false
): () => void {
  const focusableElements = getFocusableElements(element);
  if (!focusableElements.length) return () => {};

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  // Store the element that had focus before the trap was created
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

    // Return focus to trigger element
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
  };
}
