import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './wired-item.js';

@customElement('wired-tab')
export class WiredTab extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    <div id="overlay"><svg></svg></div>
    `;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, s: Point) {
    rectangle(svg, 2, 2, s[0] - 4, s[1] - 4, this.seed);
  }
}