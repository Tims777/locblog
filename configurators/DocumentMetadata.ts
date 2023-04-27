import type { Directive } from "preactify-markdown/types.d.ts";
import type { ConfiguratorContext } from "../types.d.ts";

function format(x: unknown): string | null {
  switch (typeof x) {
    case "string":
      return x;
    case "number":
    case "bigint":
    case "boolean":
      return x.toString();
    case "object":
      if (x === null) return null;
      else if (x instanceof Date) return x.toLocaleDateString();
      else return x.toString();
    case "undefined":
    default:
      return null;
  }
}

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
      .map(format)
      .filter((x) => x !== null),
  };
}
