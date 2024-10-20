import { WiredBase, BaseCSS, Point } from './wired-base';
import { svgNode } from './wired-lib';
import { css, TemplateResult, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('wired-checkbox')
export class WiredCheckbox extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @state() private focused = false;

  @query('input') private input?: HTMLInputElement;

  private svgCheck?: SVGElement;

  static get styles() {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: var(--wired-checkbox-default-swidth, 0.7);
      }
      .check path {
        stroke-width: 2.5;
      }
      #container.focused, #container:active {
        --wired-checkbox-default-swidth: 1.5;
      }
      `
    ];
  }

  focus() {
    if (this.input) {
      this.input.focus();
    } else {
      super.focus();
    }
  }

  render(): TemplateResult {
    this.refreshCheckVisibility();
    return html`
    <label id="container" class="${this.focused ? 'focused' : ''}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"
        @change="${this.onChange}"
        @focus="${() => this.focused = true}"
        @blur="${() => this.focused = false}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
  }

  private onChange() {
    this.checked = !this.checked;
    this.fire('change', { checked: this.checked });
  }

  protected canvasSize(): Point {
    return [24, 24];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const options = this.options();
    this.rectangle(svg, 0, 0, size[0], size[1], options);
    this.svgCheck = svgNode('g');
    this.svgCheck.classList.add('check');
    svg.appendChild(this.svgCheck);
    this.line(this.svgCheck, size[0] * 0.3, size[1] * 0.4, size[0] * 0.5, size[1] * 0.7, options);
    this.line(this.svgCheck, size[0] * 0.5, size[1] * 0.7, size[0] + 5, -5, options);
    this.refreshCheckVisibility();
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '' : 'none';
    }
  }
}