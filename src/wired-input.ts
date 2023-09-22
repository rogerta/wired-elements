import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-input')
export class WiredInput extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) placeholder = '';
  @property({ type: String }) name?: string;
  @property({ type: String }) min?: string;
  @property({ type: String }) max?: string;
  @property({ type: String }) step?: string;
  @property({ type: String }) type = 'text';
  @property({ type: String }) autocomplete = '';
  @property({ type: String }) autocapitalize = '';
  @property({ type: String }) autocorrect = '';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) autofocus = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) size?: number;
  @property({ type: Boolean }) hidespinbox = false;

  @query('input') private textInput!: HTMLInputElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 150px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
        input:focus + div path {
          stroke-width: 1.5;
        }
        input.hidespinbox::-webkit-outer-spin-button,
        input.hidespinbox::-webkit-inner-spin-button {
          -moz-appearance: textfield;
          -webkit-appearance: none;
          margin: 0;
        }
      `
    ];
  }

  render(): TemplateResult {
    const cls = this.hidespinbox ? 'hidespinbox' : ''
    return html`
    <input part="inner" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" .value="${this.value}"
      @change="${this.changed}" @input="${this.changed}" class="${cls}">
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  get input(): HTMLInputElement | undefined {
    return this.textInput;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 2, size[1] - 2, this.seed);
  }

  private changed(_: Event) {
    this.value = this.textInput.value;
  }

  focus() {
    if (this.textInput) {
      this.textInput.focus();
    } else {
      super.focus();
    }
  }
}