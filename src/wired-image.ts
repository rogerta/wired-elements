import { WiredBase, BaseCSS, Point } from './wired-base';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

@customElement('wired-image')
export class WiredImage extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) src: string = EMPTY_IMAGE;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          line-height: 1;
          padding: 3px;
        }
        img {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <img src="${this.src}">
    <div id="overlay"><svg></svg></div>
    `;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const w = s.width + ((elev - 1) * 2);
    const h = s.height + ((elev - 1) * 2);
    return [w, h];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const s = {
      width: size[0] - ((elev - 1) * 2),
      height: size[1] - ((elev - 1) * 2)
    };
    const options = this.options();

    this.rectangle(svg, 2, 2, s.width - 4, s.height - 4, options);
    for (let i = 1; i < elev; i++) {
      (this.line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, options)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
  }
}