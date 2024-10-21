import { WiredBase, BaseCSS, Point } from './wired-base';
import { css, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-card')
export class WiredCard extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) fill?: string;

  static get styles() {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
        .cardFill path {
          stroke-width: 4.5;
          stroke: var(--wired-card-background-fill);
        }
        path {
          stroke: var(--wired-card-background-fill, currentColor);
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div id="overlay"><svg></svg></div>
    <div part="inner" style="position: relative;">
      <slot></slot>
    </div>
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
    if (this.fill && this.fill.trim()) {
      const f = this.rectangle(svg, 2, 2, s.width - 4, s.height - 4, {...options, stroke: 'none', fill: this.fill});
      f.classList.add('cardFill');
      svg.style.setProperty('--wired-card-background-fill', this.fill.trim());
    }

    this.rectangle(svg, 2, 2, s.width - 4, s.height - 4, options);

    for (let i = 1; i < elev; i++) {
      (this.line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), options)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (this.line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, options)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
  }
}