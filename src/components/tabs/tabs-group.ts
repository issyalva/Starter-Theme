/**
 * A tabs wrapper that owns all tab/panel behavior.
 *
 * Expected markup:
 * <ui-tabs-group>
 *   <div data-tablist role="tablist" aria-label="Product information tabs">
 *     <button
 *       type="button"
 *       data-tab
 *       id="product-details-tab"
 *       role="tab"
 *       aria-controls="product-details-panel"
 *     >
 *       Details
 *     </button>
 *     <button
 *       type="button"
 *       data-tab
 *       id="product-reviews-tab"
 *       role="tab"
 *       aria-controls="product-reviews-panel"
 *     >
 *       Reviews
 *     </button>
 *   </div>
 *   <div
 *     data-panel
 *     id="product-details-panel"
 *     role="tabpanel"
 *     aria-labelledby="product-details-tab"
 *   >
 *     Details content
 *   </div>
 *   <div
 *     data-panel
 *     id="product-reviews-panel"
 *     role="tabpanel"
 *     aria-labelledby="product-reviews-tab"
 *   >
 *     Reviews content
 *   </div>
 * </ui-tabs-group>
 *
 * @note Static accessibility attributes should be authored in markup:
 * role="tablist", role="tab", role="tabpanel", id, aria-controls,
 * and aria-labelledby.
 * Dynamic state attributes are managed by the component:
 * aria-selected, tabindex, and hidden.
 */
export class TabsGroup extends HTMLElement {
  private _isMounted = false;
  private _tabs: HTMLElement[] = [];
  private _panels: HTMLElement[] = [];
  private _cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    if (this._isMounted) return;
    this._isMounted = true;

    this._setup();
  }

  disconnectedCallback(): void {
    if (!this._isMounted) return;
    this._isMounted = false;

    this._runCleanup();
    this._tabs = [];
    this._panels = [];
  }

  private _setup(): void {
    const tablist = this.querySelector('[data-tablist]') as HTMLElement | null;

    this._tabs = Array.from(this.querySelectorAll('[data-tab]')) as HTMLElement[];
    this._panels = Array.from(
      this.querySelectorAll('[data-panel]')
    ) as HTMLElement[];

    const total = Math.min(this._tabs.length, this._panels.length);
    if (!tablist || total === 0) return;

    let initialIndex = this._tabs.findIndex((tab) =>
      tab.hasAttribute('data-active')
    );
    if (initialIndex < 0 || initialIndex >= total) {
      initialIndex = 0;
    }
    for (let index = 0; index < total; index += 1) {
      const tab = this._tabs[index];

      const onClick = (): void => {
        this._activate(index, true);
      };

      const onKeydown = (event: Event): void => {
        if (!(event instanceof KeyboardEvent)) return;
        this._onTabKeydown(event, index, total);
      };

      tab.addEventListener('click', onClick);
      tab.addEventListener('keydown', onKeydown);

      this._addCleanup(() => tab.removeEventListener('click', onClick));
      this._addCleanup(() => tab.removeEventListener('keydown', onKeydown));
    }

    this._activate(initialIndex, false);
  }

  private _activate(index: number, shouldFocus: boolean): void {
    const total = Math.min(this._tabs.length, this._panels.length);
    if (total === 0) return;

    const safeIndex = ((index % total) + total) % total;

    for (let i = 0; i < total; i += 1) {
      const tab = this._tabs[i];
      const panel = this._panels[i];
      const isActive = i === safeIndex;

      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      panel.hidden = !isActive;
    }

    if (shouldFocus) {
      this._tabs[safeIndex].focus();
    }
  }

  private _onTabKeydown(
    event: KeyboardEvent,
    index: number,
    total: number
  ): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'Right': {
        event.preventDefault();
        this._activate(index + 1, true);
        break;
      }
      case 'ArrowLeft':
      case 'Left': {
        event.preventDefault();
        this._activate(index - 1, true);
        break;
      }
      case 'Home': {
        event.preventDefault();
        this._activate(0, true);
        break;
      }
      case 'End': {
        event.preventDefault();
        this._activate(total - 1, true);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this._activate(index, true);
        break;
      }
      default:
        break;
    }
  }

  private _addCleanup(cleanup: () => void): void {
    this._cleanupFns.push(cleanup);
  }

  private _runCleanup(): void {
    this._cleanupFns.forEach((cleanup) => cleanup());
    this._cleanupFns = [];
  }
}

if (!customElements.get('ui-tabs-group')) {
  customElements.define('ui-tabs-group', TabsGroup);
}
