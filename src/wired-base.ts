import { LitElement, css } from 'lit';
import { query } from 'lit/decorators.js';
import roughjs from 'roughjs';

import { Options, Point, defaultConfig, fireEvent, randomSeed, arc, ellipse, line, polygon, rectangle } from './wired-lib.js';
import { RoughSVG } from 'roughjs/bin/svg.js';
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
  private rough?: RoughSVG;

  firstUpdated() {
    this.ro.observe(this);
    this.wiredRender(true);
  }

  wiredRender(force = false) {
    if (this.svg) {
      if (!this.rough) {
        this.rough = roughjs.svg(this.svg, defaultConfig());
      }

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

  protected rectangle(parent: SVGElement, x: number, y: number, width: number, height: number, options?: Options) {
    return rectangle(this.rough!, parent, x + 2, y + 2, width - 4, height - 4, options);
  }

  protected line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number, options?: Options) {
    return line(this.rough!, parent, x1, y1, x2, y2, options);
  }

  protected polygon(parent: SVGElement, vertices: Point[], options?: Options) {
    return polygon(this.rough!, parent, vertices, options);
  }

  protected ellipse(parent: SVGElement, x: number, y: number, width: number, height: number, options?: Options) {
    return ellipse(this.rough!, parent, x, y, width, height, options);
  }

  protected arc(parent: SVGElement, x: number, y: number, width: number, height: number, start: number, stop: number, options?: Options) {
    return arc(this.rough!, parent, x, y, width, height, start, stop, options);
  }

  // Derived classes should override these two methods as needed.
  protected canvasSize() {
    return this.lastSize;
  }
  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}
