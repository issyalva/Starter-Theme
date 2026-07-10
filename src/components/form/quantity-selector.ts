/**
 * Button-driven quantity selector custom element.
 *
 * Enhances a quantity input so value changes happen through increment/decrement
 * controls only, while enforcing integer min/max/step constraints.
 *
 * Required markup inside <ui-quantity-selector>:
 * - One input with [data-quantity-input]
 * - One button with [data-quantity-decrement]
 * - One button with [data-quantity-increment]
 *
 * Required classes for default theme styling:
 * - Wrapper: quantity-selector
 * - Input: quantity-selector__input
 * - Buttons: quantity-selector__button
 *
 * @example
 * <ui-quantity-selector class="quantity-selector">
 *   <button type="button" data-quantity-decrement aria-label="Decrease quantity">-</button>
 *   <input
 *     type="number"
 *     value="1"
 *     min="1"
 *     inputmode="numeric"
 *     data-quantity-input
 *   >
 *   <button type="button" data-quantity-increment aria-label="Increase quantity">+</button>
 * </ui-quantity-selector>
 */
export class QuantitySelector extends HTMLElement {
  private _isMounted = false;
  private _input: HTMLInputElement | null = null;
  private _decrementButton: HTMLButtonElement | null = null;
  private _incrementButton: HTMLButtonElement | null = null;
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;

    this._input = this.querySelector<HTMLInputElement>('[data-quantity-input]');
    this._decrementButton = this.querySelector<HTMLButtonElement>(
      '[data-quantity-decrement]'
    );
    this._incrementButton = this.querySelector<HTMLButtonElement>(
      '[data-quantity-increment]'
    );

    if (!this._input || !this._decrementButton || !this._incrementButton) {
      return;
    }

    this._isMounted = true;

    this._input.readOnly = true;
    this._input.setAttribute('aria-readonly', 'true');

    const onDecrementClick = (): void => {
      if (!this._input) return;

      const step = this._getStep();
      const currentValue = this._normalizeValue(this._input.value);
      this._setValue(currentValue - step, true);
    };

    const onIncrementClick = (): void => {
      if (!this._input) return;

      const step = this._getStep();
      const currentValue = this._normalizeValue(this._input.value);
      this._setValue(currentValue + step, true);
    };

    this._decrementButton.addEventListener('click', onDecrementClick);
    this._incrementButton.addEventListener('click', onIncrementClick);

    this._addCleanup(() =>
      this._decrementButton?.removeEventListener('click', onDecrementClick)
    );
    this._addCleanup(() =>
      this._incrementButton?.removeEventListener('click', onIncrementClick)
    );

    this._setValue(this._input.value);
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._input = null;
    this._decrementButton = null;
    this._incrementButton = null;
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }

  private _getIntegerAttribute(name: string, fallback: number): number {
    if (!this._input) return fallback;

    const rawValue = this._input.getAttribute(name);
    if (rawValue === null || rawValue.trim() === '') {
      return fallback;
    }

    const value = Number.parseInt(rawValue, 10);
    return Number.isFinite(value) ? value : fallback;
  }

  private _getStep(): number {
    const rawStep = this._getIntegerAttribute('step', 1);
    return rawStep > 0 ? rawStep : 1;
  }

  private _normalizeValue(rawValue: number | string): number {
    const min = this._getIntegerAttribute('min', 0);
    const max = this._getIntegerAttribute('max', Number.POSITIVE_INFINITY);
    const step = this._getStep();

    const parsed = Number.parseInt(String(rawValue), 10);
    const baseValue = Number.isFinite(parsed) ? parsed : min;
    const steppedValue = Math.round((baseValue - min) / step) * step + min;

    if (steppedValue < min) return min;
    if (steppedValue > max) return max;

    return steppedValue;
  }

  private _updateDisabledState(): void {
    if (!this._input) return;

    const currentValue = this._normalizeValue(this._input.value);
    const min = this._getIntegerAttribute('min', 0);
    const max = this._getIntegerAttribute('max', Number.POSITIVE_INFINITY);

    if (this._decrementButton) {
      this._decrementButton.disabled = currentValue <= min;
    }

    if (this._incrementButton) {
      this._incrementButton.disabled = currentValue >= max;
    }
  }

  private _setValue(nextValue: number | string, shouldNotify = false): void {
    if (!this._input) return;

    const previousValue = this._input.value;
    const normalizedValue = String(this._normalizeValue(nextValue));

    this._input.value = normalizedValue;
    this._updateDisabledState();

    if (shouldNotify && normalizedValue !== previousValue) {
      this._input.dispatchEvent(new Event('input', { bubbles: true }));
      this._input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

if (!customElements.get('ui-quantity-selector')) {
  customElements.define('ui-quantity-selector', QuantitySelector);
}
