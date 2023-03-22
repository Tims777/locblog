import { type ComponentChild, createElement, render, type VNode } from "preact";
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
  if (el && typeof el === "object" && "type" in el && "props" in el) {
    if (typeof el.type === "string" && typeof el.props === "object") {
      const type = el.type;
      const { children, ...props } = el.props as Record<string, unknown>;
      const resurectedChildren = Array.isArray(children)
        ? children.map(revive)
        : revive(children);
      return createElement(type, props, resurectedChildren);
    }
  }
  return null;
}
