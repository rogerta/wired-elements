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
    const bounds = this.getBoundingClientRect();
    return this.expandForElevation(bounds, this.elevation);
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const options = this.options();
    const bounds = this.contractForElevation(size, this.elevation);

    if (this.fill && this.fill.trim()) {
      const f = this.rectangle(svg, 0, 0, bounds[0], bounds[1], {...options, stroke: 'none', fill: this.fill});
      f.classList.add('cardFill');
      svg.style.setProperty('--wired-card-background-fill', this.fill.trim());
    }

    this.rectangle(svg, 0, 0, bounds[0], bounds[1], options);
    this.drawElevation(svg, 0, 0, bounds[0], bounds[1], this.elevation, options);
  }
}