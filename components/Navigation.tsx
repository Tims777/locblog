import type { ComponentChildren } from "preact";

interface NavigationProps {
  children: ComponentChildren;
}

export default function Navigation(props: NavigationProps) {
  return (
    <nav class="[&>*]:flex [&>*]:justify-around [&>*]:list-none">{props.children}</nav>
  );
}
