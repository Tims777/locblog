import PostMark from "./PostMark.tsx";

const MAX_ADDRESS_LINES = 5;

export interface PostCardProps {
  image?: string;
  title?: string;
  href?: string;
  posted?: string;
  author?: string;
  summary?: string;
  address?: string[];
}

export default function PostCard(props: PostCardProps) {
  const cardClasses = [
    "aspect-[3/2]",
    "relative",
    "shadow-lg",
    "shadow-gray-500",
    "rotate-y-0",
    "group-hover:rotate-y-10",
    "group-focus-within:rotate-y-180",
    "transition duration-1000",
    "children:backface-hidden",
    "preserve-3d",
    "cursor-pointer",
  ].join(" ");
  return (
    <div class="group mb-12 perspective-20" tabIndex={0}>
      <div class={cardClasses}>
        <FrontSide {...props} />
        <BackSide {...props} />
      </div>
    </div>
  );
}

export function FrontSide(props: PostCardProps) {
  const containerClasses = [
    "absolute",
    "w-full",
    "h-full",
    "block",
    "bg-gray-500",
    `bg-[url('${props.image}')]`,
    "bg-cover",
    "mb-4",
  ].join(" ");
  const titleClasses = [
    "backface-hidden",
    "absolute",
    "bottom-0",
    "w-full",
    "p-2",
    "text-xl",
    "text-white",
    "text-center",
    "font-mono",
    "bg-gradient-to-t",
    "from-black",
  ].join(" ");
  return (
    <div class={containerClasses}>
      <h2 class={titleClasses}>
        {props.title}
      </h2>
    </div>
  );
}

export function BackSide(props: PostCardProps) {
  const containerClasses = [
    "absolute",
    "w-full",
    "h-full",
    "px-4",
    "py-8",
    "bg-gray-50",
    "rotate-y-180",
    "max-sm:text-sm",
  ].join(" ");

  let address = props.address ?? [];
  if (address.length > MAX_ADDRESS_LINES) address = address.slice(0, MAX_ADDRESS_LINES - 1).concat("...");

  return (
    <a
      class={containerClasses}
      href={props.href}
    >
      <div class="h-full w-1/2 float-left border-(r-1,gray-600) relative flex">
        <div class="overflow-auto place-self-center max-h-full font-cursive">
          {props.summary}
        </div>
      </div>
      <div class="h-full w-1/2 float-left">
        <div class="h-2/5 w-full relative">
          <img src="/stamp.png" class="absolute w-1/2 right-0 top-6" />
          <PostMark
            text={`Posted ${props.posted}`}
            class="absolute w-1/3 right-1/3 top-0 font-monospace"
          />
        </div>
        <div class="h-3/5 w-full flex place-content-center place-items-center text-center font-cursive">
          <ul>
            {address.map((l) => <li>{l}</li>)}
          </ul>
        </div>
      </div>
    </a>
  );
}
