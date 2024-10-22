import { WiredBase, BaseCSS, Point } from './wired-base';
import { svgNode } from './wired-lib';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-checkbox')
export class WiredCheckbox extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, reflect: true }) tabIndex = 0;

  private svgCheck?: SVGElement;

  static get styles() {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-flex;
        font-family: inherit;
        position: relative;
        user-select: none;
        cursor: pointer;
        flex-direction: row;
        min-height: 24px;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      span {
        margin-left: 24px;
        line-height: 24px;
      }
      path {
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: var(--wired-checkbox-default-swidth, 0.7);
      }
      .check path {
        stroke-width: 2.5;
      }
      :host(:focus) {
        outline: none;
      }
      :host(:focus) path {
        --wired-checkbox-default-swidth: 1.5;
      }
      `
    ];
  }

  firstUpdated() {
    super.firstUpdated();
    this.addEventListener('click', _ => {
      this.checked = !this.checked;
      this.fire('change', { checked: this.checked });
    })
  }

  render() {
    this.refreshCheckVisibility();
    return html`
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    `;
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