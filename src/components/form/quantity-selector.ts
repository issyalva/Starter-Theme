export class QuantitySelector extends HTMLElement {
  private _isMounted = false;
  private _input: HTMLInputElement | null = null;
  private _controls: HTMLButtonElement[] = [];
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

    this._input = this.querySelector<HTMLInputElement>('[data-quantity-input]');
    this._controls = Array.from(
      this.querySelectorAll<HTMLButtonElement>('[data-quantity-change]')
    );

    if (!this._input || this._controls.length === 0) {
      return;
    }

    this._input.readOnly = true;
    this._input.setAttribute('aria-readonly', 'true');

    this._controls.forEach((control) => {
      const onClick = (): void => {
        if (!this._input) return;

        const step = this._getIntegerAttribute('step', 1);
        const deltaMultiplier = Number(control.dataset.quantityChange);

        if (!Number.isFinite(deltaMultiplier)) return;

        const currentValue = this._normalizeValue(this._input.value);
        this._setValue(currentValue + step * deltaMultiplier);
      };

      control.addEventListener('click', onClick);
      this._addCleanup(() => control.removeEventListener('click', onClick));
    });

    this._setValue(this._input.value);
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._input = null;
    this._controls = [];
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

  private _normalizeValue(rawValue: number | string): number {
    const min = this._getIntegerAttribute('min', 0);
    const max = this._getIntegerAttribute('max', Number.POSITIVE_INFINITY);
    const rawStep = this._getIntegerAttribute('step', 1);
    const step = rawStep > 0 ? rawStep : 1;

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
    const min = this._getIntegerAttribute('min', Number.NEGATIVE_INFINITY);
    const max = this._getIntegerAttribute('max', Number.POSITIVE_INFINITY);

    this._controls.forEach((control) => {
      const delta = Number(control.dataset.quantityChange);
      if (!Number.isFinite(delta)) return;

      if (delta < 0) {
        control.disabled = currentValue <= min;
      } else if (delta > 0) {
        control.disabled = currentValue >= max;
      }
    });
  }

  private _setValue(nextValue: number | string): void {
    if (!this._input) return;

    this._input.value = String(this._normalizeValue(nextValue));
    this._updateDisabledState();
  }
}

if (!customElements.get('ui-quantity-selector')) {
  customElements.define('ui-quantity-selector', QuantitySelector);
}
