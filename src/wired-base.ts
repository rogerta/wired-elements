import { LitElement, css } from 'lit';
import { query } from 'lit/decorators.js';

import { Options, Point } from './wired-lib.js';
export { Point } from './wired-lib.js';

export const BaseCSS = css`
:host {
  opacity: 0;
}
:host(.wired-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;

export abstract class WiredBase extends LitElement {
  @query('svg') protected svg?: SVGSVGElement;

  private lastSize: Point = [0, 0];
  private seed = randomSeed();
  private ro = new ResizeObserver(_ => this.wiredRender());

  firstUpdated() {
    this.ro.observe(this);
    this.wiredRender(true);
  }

  wiredRender(force = false) {
    if (this.svg) {
      const size = this.canvasSize();
      if ((!force) && (size[0] === this.lastSize[0]) && (size[1] === this.lastSize[1])) {
        return;
      }
      while (this.svg.hasChildNodes()) {
        this.svg.removeChild(this.svg.lastChild!);
      }
      this.svg.setAttribute('width', `${size[0]}`);
      this.svg.setAttribute('height', `${size[1]}`);
      this.draw(this.svg, size);
      this.lastSize = size;
      this.classList.add('wired-rendered');
    }
  }

  fire(name: string, detail?: any) {
    fireEvent(this, name, detail);
  }

  protected options(): Options {
    return {seed: this.seed};
  }

  // Derived classes should override these two methods as needed.
  protected canvasSize() {
    return this.lastSize;
  }
  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function fireEvent(e: HTMLElement, name: string, detail?: any) {
  e.dispatchEvent(new CustomEvent(name, {
    composed: true,
    bubbles: true,
    detail
  }));
}