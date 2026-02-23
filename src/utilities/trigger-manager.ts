/**
 * Sets up click handlers for external elements that control a component via aria-controls.
 * Enables declarative control without requiring JavaScript references to the component.
 */
export function setupExternalTriggers(
  targetId: string,
  callback: () => void
): () => void {
  if (!targetId) return () => {};

  const escapedTargetId = CSS.escape(targetId);
  const triggers = document.querySelectorAll(
    `[aria-controls="${escapedTargetId}"]`
  );
  if (!triggers.length) return () => {};

  const handleClick = (e: Event): void => {
    e.preventDefault();
    callback();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', handleClick);
  });

  return () => {
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', handleClick);
    });
  };
}

/**
 * Updates aria-expanded on all triggers controlling the target element.
 * Accepts cached triggers for performance, avoiding repeated DOM queries on every state change.
 */
export function updateTriggerAria(
  targetId: string,
  isExpanded: boolean,
  cachedTriggers: Element[] | null = null
): Element[] | null {
  if (!targetId) return null;

  const escapedTargetId = CSS.escape(targetId);

  let triggers: Element[];

  if (cachedTriggers) {
    triggers = cachedTriggers.filter((trigger) => document.contains(trigger));
  } else {
    triggers = Array.from(
      document.querySelectorAll(`[aria-controls="${escapedTargetId}"]`)
    );
  }

  if (triggers.length === 0) return null;

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', String(isExpanded));
  });

  return triggers;
}
