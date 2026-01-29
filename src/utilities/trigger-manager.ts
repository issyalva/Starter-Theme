/**
 * Manages external trigger elements that control a component via aria-controls.
 * 
 * Automatically finds all elements with aria-controls matching the targetId,
 * caches them for performance, and sets up click handlers. Returns a cleanup
 * function to remove all listeners.
 * 
 * @param targetId - The ID of the element being controlled
 * @param action - The action to perform when triggers are activated
 * @returns Cleanup function that removes all event listeners
 * 
 * @example
 * const cleanup = setupExternalTriggers('my-disclosure', () => this.toggle());
 * // Later, in disconnectedCallback:
 * cleanup();
 */
export function setupExternalTriggers(
  targetId: string,
  action: () => void
): () => void {
  if (!targetId) return () => {};

  // Cache the trigger query
  const triggers = document.querySelectorAll(`[aria-controls="${targetId}"]`);
  if (!triggers.length) return () => {};

  const cleanupFunctions: (() => void)[] = [];

  const handleClick = (e: Event): void => {
    e.preventDefault();
    action();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', handleClick);
    cleanupFunctions.push(() => {
      trigger.removeEventListener('click', handleClick);
    });
  });

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((fn) => fn());
  };
}

/**
 * Updates aria-expanded attribute on all triggers controlling the target element.
 * 
 * More efficient than querying DOM on every state change when using cached triggers.
 * Validates cached triggers are still in the document before updating.
 * 
 * @param targetId - The ID of the element being controlled
 * @param isExpanded - Whether the controlled element is expanded
 * @param cachedTriggers - Optional cached triggers to update (validates they're still in DOM)
 * @returns Array of triggers that were updated (for caching), or null if none found
 * 
 * @example
 * // First call - returns triggers for caching
 * this._triggers = updateTriggerAria(this.id, this.open);
 *
 * // Subsequent calls - use cached triggers
 * updateTriggerAria(this.id, this.open, this._triggers);
 */
export function updateTriggerAria(
  targetId: string,
  isExpanded: boolean,
  cachedTriggers: Element[] | null = null
): Element[] | null {
  if (!targetId) return null;

  let triggers: Element[];

  if (cachedTriggers) {
    // Validate that cached triggers are still in the document
    triggers = cachedTriggers.filter((trigger) => document.contains(trigger));
  } else {
    // Convert NodeList to Array for consistency
    triggers = Array.from(
      document.querySelectorAll(`[aria-controls="${targetId}"]`)
    );
  }

  // Return null if no triggers found (consistent return behavior)
  if (triggers.length === 0) return null;

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', String(isExpanded));
  });

  return triggers;
}
