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
    const size = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const w = size.width + ((elev - 1) * 2);
    const h = size.height + ((elev - 1) * 2);
    return [w, h];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const width = size[0] - ((elev - 1) * 2);
    const height = size[1] - ((elev - 1) * 2);
    const options = this.options();
    this.rectangle(svg, 0, 0, width, height, options);
    let hoffset = 4;
    let voffset = 0;
    let opacity = 0.75;
    for (let i = 1; i < elev; i++) {
      (this.line(svg, hoffset, height + voffset, width + hoffset - 4, height + voffset, options)).style.opacity = `${opacity}`;
      (this.line(svg, width + hoffset - 4, height + voffset, width + hoffset - 4, voffset + 2, options)).style.opacity = `${opacity}`;
      hoffset += 2;
      voffset += 2;
      opacity -= 0.15;
    }
  }
}
