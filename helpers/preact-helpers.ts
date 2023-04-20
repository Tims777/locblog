import {
  type ComponentChild,
  type ComponentType,
  createElement,
  Fragment,
  render,
  type VNode,
} from "preact";
import { type StateUpdater } from "preact/hooks";

export function renderToElement(node: ComponentChild): Element {
  const template = document.createElement("template");
  render(node, template);
  return template.firstElementChild!;
}

function mod(n: number, m: number) {
  return (n % m + m) % m;
}

export function createStepper(
  setter: StateUpdater<number>,
  step: number,
  overflow: number,
) {
  return [
    () => setter((v) => mod(v - step, overflow)),
    () => setter((v) => mod(v + step, overflow)),
  ];
}

export function revive(el: unknown): VNode | null {
  if (el === null || el === undefined) {
    return null;
  }
  if (Array.isArray(el)) {
    return createElement(Fragment, {}, el.map(revive));
  }
  if (typeof el === "object" && "props" in el) {
    if (typeof el.props === "object") {
      const type = "type" in el ? el.type as ComponentType : Fragment;
      const { children, ...props } = el.props as { children: unknown };
      return createElement(type, props, revive(children));
    }
  } else if (["string", "number", "boolean"].indexOf(typeof el) >= 0) {
    return createElement(Fragment, {}, el);
  }
  console.warn("Could not revive", el, typeof el);
  return null;
}

export function makeArray<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

export function asChildren<T>(x: T) {
  return { children: x };
}
