import formatter from "../services/format.ts";

export interface CommentProps {
  content: string;
  author: string;
  published?: Date;
}

export default function Comment(props: CommentProps) {
  const expandingAuthorCircleClasses = [
    "absolute",
    "left-0",
    "h-10",
    "leading-10",
    "px-3",
    "whitespace-nowrap",
    "overflow-hidden",
    "max-w-[2.5rem]",
    "group-focus-within:max-w-[25rem]",
    "group-hover:max-w-[25rem]",
    "transition-[max-width]",
    "bg-gray-300",
    "rounded-full",
  ].join(" ");
  return (
    <div class="w-full flex items-center mb-4">
      <div class="flex-none w-10 h-10 relative group" tabIndex={0}>
        <div class={expandingAuthorCircleClasses}>
          <span class="inline-block w-4 text-center font-bold font-monospace text-xl leading-10">
            {props.author[0]}
          </span>
          <span class="invisible group-focus-within:visible group-hover:visible">
            {props.author.slice(1)}
          </span>
        </div>
      </div>
      <div class="bg-gray-200 rounded-lg shrink m-2 p-2">
        <div class="text-sm text-center">
          {formatter.format(props.published)}
        </div>
        {props.content}
      </div>
    </div>
  );
}
