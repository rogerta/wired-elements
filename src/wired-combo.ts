import { css, TemplateResult, html, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { rectangle, polygon } from './wired-lib';
import { WiredBase, BaseCSS, Point } from './wired-base';
import { WiredItem } from './wired-item';

import './wired-card';
import './wired-item';

interface ComboValue {
  value: string;
  text: string;
}

@customElement('wired-combo')
export class WiredCombo extends WiredBase {
  @property({ type: Object }) value?: ComboValue;
  @property({ type: String, reflect: true }) selected?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('slot') private cardSlot!: HTMLSlotElement;
  @query('#textPanel') private textPanel!: HTMLDivElement;
  @query('#dropPanel') private dropPanel!: HTMLDivElement;

  @state() private cardShowing = false;

  get itemNodes() {
    return (this.cardSlot.assignedNodes() as HTMLElement[])
        .filter(n => n.tagName === 'WIRED-ITEM') as WiredItem[];
  }

  static get styles() {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
      }
    
      :host(.wired-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
      
      :host(:focus) path {
        stroke-width: 1.5;
      }
    
      #container {
        white-space: nowrap;
        position: relative;
      }
    
      .inline {
        display: inline-block;
        vertical-align: top
      }

      .hidden {
        display: none;
      }

      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }
    
      #dropPanel {
        width: 34px;
        cursor: pointer;
      }
    
      #card {
        display: block;
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
        padding: 8px;
      }
  
      ::slotted(wired-item) {
        display: block;
      }
    `];
  }

  render(): TemplateResult {
    return html`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div id="overlay"><svg></svg></div>
    </div>
    <wired-card exportparts="inner: card-inner" id="card" tabindex="-1" role="listbox"
        class="${this.cardShowing ? '' : 'hidden'}"
        @click="${this.onItemClick}">
      <slot id="slot"></slot>
    </wired-card>
    `;
  }

  private refreshDisabledState() {
    this.classList.toggle('wired-disabled', this.disabled);
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  firstUpdated() {
    super.firstUpdated();
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.refreshSelection();

    this.addEventListener('blur', (event) => {
      // If the user clicked outside the combo, hide the card if showing.
      const related = event.relatedTarget as Element;
      const combo = related?.closest('wired-combo');
      if (combo !== this) {
        this.cardShowing = false;
      }
    });
    this.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
        case 38:
          event.preventDefault();
          this.selectOther(-1);
          break;
        case 39:
        case 40:
          event.preventDefault();
          this.selectOther(1);
          break;
        case 27:
          event.preventDefault();
          this.cardShowing = false;
          break;
        case 13:
          event.preventDefault();
          this.cardShowing = !this.cardShowing;
          break;
        case 32:
          event.preventDefault();
          this.cardShowing = true;
          break;
      }
    });
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    if (changed.has('selected')) {
      this.refreshSelection();
    }
    if (changed.has('cardShowing')) {
      this.setAttribute('aria-expanded', `${this.cardShowing}`);
    }

    this.itemNodes.forEach(n => {
      n.setAttribute('role', 'option');
    });
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, _size: Point) {
    const textBounds = this.textPanel.getBoundingClientRect();
    this.dropPanel.style.minHeight = textBounds.height + 'px';
    rectangle(svg, 0, 0, textBounds.width, textBounds.height, this.seed);
    const dropx = textBounds.width - 4;
    rectangle(svg, dropx, 0, 34, textBounds.height, this.seed);
    const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
    const poly = polygon(svg, [
      [dropx + 8, 5 + dropOffset],
      [dropx + 26, 5 + dropOffset],
      [dropx + 17, dropOffset + Math.min(textBounds.height, 18)]
    ], this.seed);
    poly.style.fill = 'currentColor';
    poly.style.pointerEvents = this.disabled ? 'none' : 'auto';
    poly.style.cursor = 'pointer';
  }

  private refreshSelection() {
    this.value = undefined;
    this.itemNodes.forEach(n => {
      n.selected = n.value === this.selected;
      if (n.selected) {
        n.setAttribute('aria-selected', 'true');
        this.value = {
          value: this.selected || '',
          text: n.textContent || ''
        };
      } else {
        n.removeAttribute('aria-selected');
      }
    });
  }

  private onItemClick(event: CustomEvent) {
    event.stopPropagation();
    this.selected = (event.target as WiredItem).value;
    this.fireSelected();
    this.cardShowing = false;
  }

  private fireSelected() {
    this.fire('selected', { selected: this.selected });
  }

  private selectOther(inc: number) {
    const nodes = this.itemNodes;
    if (nodes.length === 0) {
      return;
    }

    let index = nodes.findIndex(n => n.value === this.selected);
    index = (index + inc) % nodes.length;
    this.selected = nodes[index].value;
    this.fireSelected();
  }

  private onCombo(event: Event) {
    event.stopPropagation();
    this.cardShowing = !this.cardShowing;
  }
}