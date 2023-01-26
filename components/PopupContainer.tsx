import { VNode } from "preact";

interface ContainerProps {
  children: VNode | VNode[];
}

export default function PopupContainer(props: ContainerProps) {
  return <div style="background-color: rgba(255,255,255,0.9); padding: 5px; border-radius: 0px 10px 10px;">{props.children}</div>
}
