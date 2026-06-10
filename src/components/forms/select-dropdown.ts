/**
 * A lightweight custom select that keeps native form submission via a hidden input.
 *
 * Required markup:
 * <ui-select>
 *   <button type="button" data-select-trigger>
 *     <span data-select-label></span>
 *   </button>
 *   <ul data-select-menu>
 *     <li><button type="button" data-select-option data-value="value">Label</button></li>
 *   </ul>
 *   <input type="hidden" data-select-input name="field_name">
 * </ui-select>
 */
export class SelectDropdown extends HTMLElement {
  private _isMounted = false;
  private _cleanupFns: Array<() => void> = [];

  private _trigger: HTMLButtonElement | null = null;
  private _label: HTMLElement | null = null;
  private _menu: HTMLElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _options: HTMLButtonElement[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

    this._cacheElements();

    if (!this._trigger || !this._menu || this._options.length === 0) {
      return;
    }

    this._setupInteraction();
    this._syncInitialState();
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._close();
  }

  private _cacheElements(): void {
    this._trigger = this.querySelector('[data-select-trigger]');
    this._label = this.querySelector('[data-select-label]');
    this._menu = this.querySelector('[data-select-menu]');
    this._input = this.querySelector('[data-select-input]');
    this._options = Array.from(
      this.querySelectorAll('[data-select-option]')
    ).filter((option): option is HTMLButtonElement => option instanceof HTMLButtonElement);

    if (this._trigger) {
      this._trigger.setAttribute('aria-haspopup', 'listbox');
      this._trigger.setAttribute('aria-expanded', 'false');
    }

    if (this._menu) {
      this._menu.setAttribute('hidden', '');
    }

    this._options.forEach((option) => {
      option.setAttribute('role', 'option');
      option.tabIndex = -1;
    });
  }

  private _setupInteraction(): void {
    if (!this._trigger || !this._menu) return;

    const onTriggerClick = (): void => {
      if (this._isOpen()) {
        this._close();
      } else {
        this._open();
      }
    };

    const onTriggerKeydown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case 'ArrowDown':
        case 'Enter':
        case ' ': {
          event.preventDefault();
          this._open();
          this._focusSelectedOption();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          this._open();
          this._focusLastOption();
          break;
        }
        default:
          break;
      }
    };

    const onMenuKeydown = (event: KeyboardEvent): void => {
      if (!this._isOpen()) return;

      const focusedOption = document.activeElement;
      const currentIndex = this._options.indexOf(focusedOption as HTMLButtonElement);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % this._options.length;
          this._options[nextIndex].focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const previousIndex =
            currentIndex < 0
              ? this._options.length - 1
              : (currentIndex - 1 + this._options.length) % this._options.length;
          this._options[previousIndex].focus();
          break;
        }
        case 'Home':
          event.preventDefault();
          this._options[0].focus();
          break;
        case 'End':
          event.preventDefault();
          this._focusLastOption();
          break;
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (focusedOption instanceof HTMLButtonElement) {
            this._selectOption(focusedOption);
          }
          break;
        }
        case 'Escape':
          event.preventDefault();
          this._close();
          this._trigger?.focus();
          break;
        case 'Tab':
          this._close();
          break;
        default:
          break;
      }
    };

    const onOutsidePointerDown = (event: Event): void => {
      if (!this._isOpen()) return;
      if (this.contains(event.target as Node)) return;
      this._close();
    };

    this._trigger.addEventListener('click', onTriggerClick);
    this._addCleanup(() => this._trigger?.removeEventListener('click', onTriggerClick));

    this._trigger.addEventListener('keydown', onTriggerKeydown);
    this._addCleanup(() => this._trigger?.removeEventListener('keydown', onTriggerKeydown));

    this._menu.addEventListener('keydown', onMenuKeydown);
    this._addCleanup(() => this._menu?.removeEventListener('keydown', onMenuKeydown));

    document.addEventListener('pointerdown', onOutsidePointerDown);
    this._addCleanup(() =>
      document.removeEventListener('pointerdown', onOutsidePointerDown)
    );

    this._options.forEach((option) => {
      const onOptionClick = (): void => {
        this._selectOption(option);
      };

      option.addEventListener('click', onOptionClick);
      this._addCleanup(() => option.removeEventListener('click', onOptionClick));
    });
  }

  private _syncInitialState(): void {
    if (this._options.length === 0) return;

    const selectedByInput = this._input
      ? this._options.find((option) => option.dataset.value === this._input?.value)
      : null;

    const selectedByAttribute = this._options.find(
      (option) => option.getAttribute('aria-selected') === 'true'
    );

    const fallback = this._options[0];
    const optionToSelect = selectedByInput ?? selectedByAttribute ?? fallback;

    this._applySelection(optionToSelect, false);
  }

  private _selectOption(option: HTMLButtonElement): void {
    this._applySelection(option, true);
    this._close();
    this._trigger?.focus();
  }

  private _applySelection(option: HTMLButtonElement, notify: boolean): void {
    this._options.forEach((item) => {
      const isSelected = item === option;
      item.setAttribute('aria-selected', String(isSelected));
      if (isSelected) {
        item.dataset.selected = 'true';
      } else {
        delete item.dataset.selected;
      }
    });

    if (this._label) {
      this._label.textContent = option.textContent?.trim() ?? '';
    }

    if (this._input) {
      this._input.value = option.dataset.value ?? '';
      if (notify) {
        this._input.dispatchEvent(new Event('input', { bubbles: true }));
        this._input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    this.dispatchEvent(
      new CustomEvent('select:change', {
        detail: { value: option.dataset.value ?? '' },
        bubbles: true,
      })
    );
  }

  private _open(): void {
    if (!this._menu || !this._trigger) return;

    this.dataset.open = 'true';
    this._menu.removeAttribute('hidden');
    this._trigger.setAttribute('aria-expanded', 'true');
  }

  private _close(): void {
    if (!this._menu || !this._trigger) return;

    delete this.dataset.open;
    this._menu.setAttribute('hidden', '');
    this._trigger.setAttribute('aria-expanded', 'false');
  }

  private _isOpen(): boolean {
    return this.dataset.open === 'true';
  }

  private _focusSelectedOption(): void {
    const selected = this._options.find(
      (option) => option.getAttribute('aria-selected') === 'true'
    );

    (selected ?? this._options[0])?.focus();
  }

  private _focusLastOption(): void {
    this._options[this._options.length - 1]?.focus();
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}

if (!customElements.get('ui-select')) {
  customElements.define('ui-select', SelectDropdown);
}
