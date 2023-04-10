import { VNode } from "preact";

interface ContainerProps {
  children: VNode | VNode[];
}

export default function PopupContainer(props: ContainerProps) {
  return (
    <div class="not-prose p-2 bg-white bg-opacity-90 p-1 rounded-xl rounded-tl-none">
      {props.children}
    </div>
  );
}
