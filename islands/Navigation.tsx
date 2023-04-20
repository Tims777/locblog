import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { revive } from "../helpers/preact-helpers.ts";

export interface NavigationProps {
  children: ComponentChildren;
}

const svgProps = {
  viewBox: [0, 0, 40, 40].join(" "),
  stroke: "rgb(55, 65, 81)",
  "stroke-width": 2,
};

const closeSvg = (
  <svg {...svgProps}>
    <line x1={5} x2={35} y1={5} y2={35} />
    <line x1={5} x2={35} y1={35} y2={5} />
  </svg>
);

const toggleSvg = (
  <svg {...svgProps}>
    {[10, 20, 30].map((y) => <line x1={0} x2={40} y1={y} y2={y} />)}
  </svg>
);

const contentClasses = [
  "lg:children:(flex,justify-around)",
  "children:(list-none,p-0,m-0)",
  "max-h-(0,open:60,lg:20)",
  "transition-[max-height]",
  "duration-500",
  "overflow-(hidden,open:auto)",
  "text-center",
].join(" ");

const toggleClasses = [
  "w-10",
  "mx-auto",
  "lg:hidden",
].join(" ");

export default function Navigation(props: NavigationProps) {
  const [open, setOpen] = useState<boolean>(false);

  const children = typeof window !== "undefined"
    ? revive(props.children)
    : props.children;

  const toggle = () => setOpen((o) => !o);

  return (
    <nav class="mx-auto">
      <div class={toggleClasses} onClick={toggle}>
        {open ? closeSvg : toggleSvg}
      </div>
      <div
        class={contentClasses}
        open={open ? true : undefined}
      >
        {children}
      </div>
    </nav>
  );
}
