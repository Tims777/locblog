import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";
import Icon from "../components/Icon.tsx";

export default function configure(
  directive: Directive,
  _context?: ConfiguratorContext,
) {
  if (!directive.attributes) {
    return false;
  }

  return {
    class: "not-prose",
    children: Icon({ name: Object.keys(directive.attributes).join(" ")}),
  };
}