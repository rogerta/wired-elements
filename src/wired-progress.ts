import { WiredBase, BaseCSS, Point } from './wired-base';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-progress')
export class WiredProgress extends WiredBase {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) percentage = false;

  private progBox?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .progressLabel {
        color: var(--wired-progress-label-color, #000);
        font-size: var(--wired-progress-font-size, 14px);
        background: var(--wired-progress-label-background, rgba(255,255,255,0.9));
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 1.25px;
      }
      .progbox path {
        stroke: var(--wired-progress-color, rgba(0, 0, 200, 0.8));
        stroke-width: 4;
        fill: none;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `;
  }

  private getProgressLabel(): string {
    if (this.percentage) {
      if (this.max === this.min) {
        return '%';
      } else {
        const pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
        return (pct + '%');
      }
    } else {
      return ('' + this.value);
    }
  }

  updated() {
    this.refreshProgressFill();
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const options = this.options();
    this.rectangle(svg, 2, 2, size[0] - 2, size[1] - 2, options);
  }

  private refreshProgressFill() {
    if (this.progBox) {
      if (this.progBox.parentElement) {
        this.progBox.parentElement.removeChild(this.progBox);
      }
      this.progBox = undefined;
    }
    if (this.svg) {
      let pct = 0;
      const s = this.getBoundingClientRect();
      if (this.max > this.min) {
        pct = (this.value - this.min) / (this.max - this.min);
        const progWidth = s.width * Math.max(0, Math.min(pct, 100));
        const options = this.options();
        options.stroke = 'none';
        // NOTE: fill is hard coded, but actually colour set via css.
        options.fill = '#000';
        this.progBox = this.rectangle(this.svg, 0, 0, progWidth, s.height, options);
        this.progBox?.classList.add('progbox');
      }
    }
  }
}