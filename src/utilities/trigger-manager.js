/**
 * Manages external trigger elements that control a component via aria-controls.
 * Caches trigger queries and provides automatic cleanup.
 *
 * @param {string} targetId - The ID of the element being controlled
 * @param {Function} action - The action to perform when triggers are activated
 * @returns {Function} Cleanup function that removes all event listeners
 *
 * @example
 * const cleanup = setupExternalTriggers('my-disclosure', () => this.toggle());
 * // Later, in disconnectedCallback:
 * cleanup();
 */
export function setupExternalTriggers(targetId, action) {
  if (!targetId) return () => {};

  // Cache the trigger query
  const triggers = document.querySelectorAll(`[aria-controls="${targetId}"]`);
  if (!triggers.length) return () => {};

  const cleanupFunctions = [];

  const handleClick = (e) => {
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
 * Updates aria-expanded attribute on all cached triggers.
 * More efficient than querying DOM on every state change.
 *
 * @param {string} targetId - The ID of the element being controlled
 * @param {boolean} isExpanded - Whether the controlled element is expanded
 * @param {NodeList|Array} [cachedTriggers] - Optional cached triggers to update
 * @returns {NodeList} The triggers that were updated (for caching)
 *
 * @example
 * // First call - returns triggers for caching
 * this._triggers = updateTriggerAria(this.id, this.open);
 *
 * // Subsequent calls - use cached triggers
 * updateTriggerAria(this.id, this.open, this._triggers);
 */
export function updateTriggerAria(targetId, isExpanded, cachedTriggers = null) {
  if (!targetId) return null;

  const triggers =
    cachedTriggers ||
    document.querySelectorAll(`[aria-controls="${targetId}"]`);

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', isExpanded);
  });

  return triggers;
}
