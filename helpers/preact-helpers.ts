import { render, type ComponentChild } from "preact";

export function renderToElement(node: ComponentChild): Element {
    const template = document.createElement("template");
    render(node, template);
    return template.firstElementChild!;
  }