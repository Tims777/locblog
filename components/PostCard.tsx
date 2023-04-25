export interface PostCardProps {
  image?: string;
  title?: string;
  href?: string;
  summary?: string;
}

export default function PostCard(props: PostCardProps) {
  const cardClasses = [
    "aspect-[3/2]",
    "relative",
    "shadow-lg",
    "shadow-gray-500",
    "group-hover:rotate-y-10",
    "group-focus:rotate-y-180",
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
  return (
    <a
      class="absolute w-full h-full px-4 py-8 bg-gray-50 rotate-y-180 preserve-3d"
      href={props.href}
    >
      <div class="h-full w-1/2 float-left flex place-content-center place-items-center border-(r-1,gray-600) overflow-y-auto">
        {props.summary}
      </div>
      <div class="h-full w-1/2 float-left">
        <div class="h-2/5 w-full">
          <img src="/stamp.png" class="w-1/2 relative float-right" />
        </div>
        <div class="h-3/5 w-full flex place-content-center place-items-center">
          {props.title}
        </div>
      </div>
    </a>
  );
}
