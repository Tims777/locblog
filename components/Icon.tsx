export interface IconProps {
  name: string;
  variant?: string;
}

export default function Comment(props: IconProps) {
  const variant = props.variant ?? "outline";
  return (
    <img src={`https://raw.githubusercontent.com/tabler/tabler-icons/refs/heads/main/icons/${variant}/${props.name}.svg`} class="inline-block h-[1em]"></img>
  );
}
