import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";
import formatter from "../services/format.ts";

export default function configure(
  directive: Directive,
  context?: ConfiguratorContext,
) {
  if (directive.type == "containerDirective") {
    return false;
  }

  function getMetadata(key: string[], target = context?.doc ?? []): unknown {
    if (key.length == 0) {
      return target;
    } else if (key[0] in target) {
      const child = target[key[0] as keyof typeof target];
      return getMetadata(key.splice(1), child);
    } else {
      return null;
    }
  }

  return {
    children: directive.children
      .map((x) => "value" in x ? getMetadata(x.value.split(".")) : null)
      .filter((x) => x !== null)
      .map((x) => formatter.format(x)),
  };
}
