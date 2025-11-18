const getFocusableElements = (element) => {
  return element.querySelectorAll(
    'a[href]:not([disabled]), ' +
      'button:not([disabled]), ' +
      'input:not([disabled]), ' +
      'select:not([disabled]), ' +
      'textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"]), ' +
      'div[role="button"], ' +
      'a[role="button"] '
  )
}

export function createFocusTrap(element) {
  const focusableElements = getFocusableElements(element)
  console.log({focusableElements})
  if (!focusableElements.length) return () => {}

  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  if (!element.contains(document.activeElement)) {
    firstFocusableElement.focus()
    // if (preventFirstVisibleOutline)
    //   firstFocusableElement.style.outlineWidth = '0'
  }

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return
    // if (preventFirstVisibleOutline)
    //   firstFocusableElement.style.outlineWidth = 'initial'

    const shouldPreventDefault =
      (e.shiftKey && document.activeElement === firstFocusableElement) ||
      (!e.shiftKey && document.activeElement === lastFocusableElement)

    if (shouldPreventDefault) {
      e.preventDefault()
      e.shiftKey ? lastFocusableElement.focus() : firstFocusableElement.focus()
    }
  }

  element.addEventListener('keydown', handleTabKey)

  return () => element.removeEventListener('keydown', handleTabKey)
}
