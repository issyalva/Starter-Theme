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
 *       data-active
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

  private get _total(): number {
    return Math.min(this._tabs.length, this._panels.length);
  }

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

    const total = this._total;
    if (!tablist || total === 0) return;

    const initialIndex = this._getInitialIndex(total);

    for (let index = 0; index < total; index += 1) {
      const tab = this._tabs[index];
      this._bindTabEvents(tab, index, total);
    }

    this._activate(initialIndex, false);
  }

  private _getInitialIndex(total: number): number {
    const index = this._tabs.findIndex((tab) => tab.hasAttribute('data-active'));
    if (index < 0 || index >= total) return 0;
    return index;
  }

  private _bindTabEvents(tab: HTMLElement, index: number, total: number): void {
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

  private _activate(index: number, shouldFocus: boolean): void {
    const total = this._total;
    if (total === 0) return;

    const activeIndex = this._normalizeIndex(index, total);

    for (let i = 0; i < total; i += 1) {
      const tab = this._tabs[i];
      const panel = this._panels[i];
      const isActive = i === activeIndex;

      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      panel.hidden = !isActive;
    }

    if (shouldFocus) {
      this._tabs[activeIndex].focus();
    }
  }

  private _normalizeIndex(index: number, total: number): number {
    return ((index % total) + total) % total;
  }

  private _onTabKeydown(
    event: KeyboardEvent,
    index: number,
    total: number
  ): void {
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'Right': {
        nextIndex = index + 1;
        break;
      }
      case 'ArrowLeft':
      case 'Left': {
        nextIndex = index - 1;
        break;
      }
      case 'Home': {
        nextIndex = 0;
        break;
      }
      case 'End': {
        nextIndex = total - 1;
        break;
      }
      case 'Enter':
      case ' ': {
        nextIndex = index;
        break;
      }
      default:
        break;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    this._activate(nextIndex, true);
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
