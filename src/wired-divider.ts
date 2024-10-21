import { WiredBase, BaseCSS, Point } from './wired-base';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-divider')
export class WiredDivider extends WiredBase {
  @property({ type: Number }) elevation = 1;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: block;
          position: relative;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    return [size.width, elev * 6];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const options = this.options();
    for (let i = 0; i < elev; i++) {
      this.line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3, options);
    }
  }
}