import { WiredBase, BaseCSS, Point } from './wired-base';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-button')
export class WiredButton extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, reflect: true }) tabIndex = 0;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          font-size: 0.9rem;
          position: relative;
          user-select: none;
          background: none;
          cursor: pointer;
          letter-spacing: 0.08rem;
          text-transform: uppercase;
          text-align: center;
          padding: 0.6rem;
        }
        path {
          transition: transform 0.05s ease;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        :host(:active) path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        :host(:focus) path {
          stroke-width: 1.5;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
      <div id="overlay"><svg></svg></div>
    `;
  }

  protected canvasSize(): Point {
    const bounds = this.getBoundingClientRect();
    return this.expandForElevation(bounds, this.elevation);
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const options = this.options();
    const bounds = this.contractForElevation(size, this.elevation);
    this.rectangle(svg, 0, 0, bounds[0], bounds[1], options);
    this.drawElevation(svg, 0, 0, bounds[0], bounds[1], this.elevation, options);
  }
}
