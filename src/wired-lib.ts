import { Options } from 'roughjs/bin/core';
export { Options } from 'roughjs/bin/core';
import { RoughSVG } from 'roughjs/bin/svg';
import roughjs from 'roughjs';

export type Point = [number, number];

export function svgNode(tagName: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}

let grc: RoughSVG;

function rc(svg: SVGElement) {
  // The only reason an SVG element is needed here is to get the owning
  // document.  If it's ever possible for this function to be called from
  // different owning documents, the grc would need to become a Map from
  // owning document to RoughSVG.

  if (!grc) {
    let parent: Element|null = svg;
    while (parent && parent.tagName !== 'svg') {
      parent = parent.parentElement;
    }

    if (!parent)
      throw new Error('Invalid SVG element')

    const parentSVG = parent as SVGSVGElement;

    const options: Options = {
      maxRandomnessOffset: 2,
      roughness: 1,
      bowing: 0.85,
      stroke: '#000',
      strokeWidth: 1.5,
      curveTightness: 0,
      curveFitting: 0.95,
      curveStepCount: 9,
      fillStyle: 'hachure',
      fillWeight: 3.5,
      hachureAngle: -41,
      hachureGap: 5,
      dashOffset: -1,
      dashGap: -1,
      zigzagOffset: 0,
      disableMultiStroke: false,
      disableMultiStrokeFill: false,
      preserveVertices: false,
      fillShapeRoughnessGain: 0.8,  // TODO: what is the right value?
    };

    grc = roughjs.svg(parentSVG, {options})
  }

  return grc
}

export function rectangle(parent: SVGElement, x: number, y: number, width: number, height: number, options?: Options) {
  const el = rc(parent).rectangle(x + 2, y + 2, width - 4, height - 4, options);
  parent?.appendChild(el);
  return el;
}

export function line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number, options?: Options) {
  const el = rc(parent).line(x1, y1, x2, y2, options);
  parent?.appendChild(el);
  return el;
}

export function polygon(parent: SVGElement, vertices: Point[], options?: Options) {
  const el = rc(parent).polygon(vertices, options);
  parent?.appendChild(el);
  return el;
}

export function ellipse(parent: SVGElement, x: number, y: number, width: number, height: number, options?: Options) {
  width = Math.max(width > 10 ? width - 4 : width - 1, 1);
  height = Math.max(height > 10 ? height - 4 : height - 1, 1);
  const el = rc(parent).ellipse(x, y, width, height, options);
  parent?.appendChild(el);
  return el;
}

export function arc(parent: SVGElement, x: number, y: number, width: number, height: number, start: number, stop: number, options?: Options) {
  width = Math.max(width > 10 ? width - 4 : width - 1, 1);
  height = Math.max(height > 10 ? height - 4 : height - 1, 1);
  const el = rc(parent).arc(x, y, width, height, start, stop, false, options);
  parent?.appendChild(el);
  return el;
}
