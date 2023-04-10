import { ComponentChildren } from "preact";

export default function FullScreen(props: { children: ComponentChildren }) {
  return <div class="w-screen h-screen absolute top-0 left-0">{props.children}</div>;
}
