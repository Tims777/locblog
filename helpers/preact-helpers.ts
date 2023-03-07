import { type ComponentChild, render } from "preact";
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
