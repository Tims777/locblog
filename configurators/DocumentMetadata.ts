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

  // deno-lint-ignore no-explicit-any
  function getMetadata(key: string[], target: Record<string, any>): unknown {
    if (key.length == 0) {
      return target;
    } else if (target && key[0] in target) {
      const child = target[key[0] as keyof typeof target];
      return getMetadata(key.splice(1), child);
    } else {
      return null;
    }
  }

  const metadata = context?.doc ?? [];

  return {
    children: directive.children
      .map((x) => "value" in x ? getMetadata(x.value.split("."), metadata) : null)
      .filter((x) => x !== null)
      .map((x) => formatter.format(x)),
  };
}
