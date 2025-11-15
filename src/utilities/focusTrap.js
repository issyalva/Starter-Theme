export function createFocusTrap(container) {
  let previouslyFocused = null;
  let firstFocusable = null;
  let lastFocusable = null;

  function getFocusableElements() {
    return container.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    );
  }

  function trap(e) {
    // Only handle Tab and Shift+Tab
    if (e.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (!focusable.length) return;

    firstFocusable = focusable[0];
    lastFocusable = focusable[focusable.length - 1];

    // SHIFT + TAB
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
      return;
    }

    // TAB (forward)
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }

  return {
    activate() {
      previouslyFocused = document.activeElement;
      const focusable = getFocusableElements();

      if (focusable.length) {
        focusable[0].focus();
      } else {
        // Make container itself focusable
        container.setAttribute("tabindex", "-1");
        container.focus();
      }

      document.addEventListener("keydown", trap);
    },

    deactivate() {
      document.removeEventListener("keydown", trap);

      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    }
  };
}
